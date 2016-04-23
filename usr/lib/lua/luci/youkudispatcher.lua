--[[
LuCI - Dispatcher
]]--

--- LuCI web dispatcher.
local fs = require "nixio.fs"
local sys = require "luci.sys"
local init = require "luci.init"
local util = require "luci.util"
local http = require "luci.http"
local nixio = require "nixio", require "nixio.util"
local logger = require("luci.logger")
local LuciOS = require("os")

module("luci.youkudispatcher", package.seeall)
context = util.threadlocal()
uci = require "luci.model.uci"
i18n = require "luci.i18n"
_M.fs = fs

authenticator = {}

-- Index table
local index = nil

-- Fastindex
local fi


--- Send a 404 error code and render the "error404" template if available.
-- @param message	Custom error message (optional)
-- @return			false
function error404(message)
	luci.http.status(404, "Not Found")
	message = message or "Not Found"
	logger.flog(3, message)
	luci.http.redirect("/err/404.html")
	return false
end

function error403(message)
	luci.http.status(403, "Forbidden")
	message = message or "Forbidden"
	logger.flog(3, message)
	luci.http.redirect("/err/403.html")
	return false
end

--- Send a 500 error code and render the "error500" template if available.
-- @param message	Custom error message (optional)#
-- @return			false
function error500(message)
	luci.util.perror(message)
	logger.flog(3, message)
	luci.http.redirect("/err/500.html")
	return false
end

function http_request_log(request, tag)
  local requestUri = request:getenv("REQUEST_URI")
  if requestUri and tag and type(tag) == "string" then
    local uriInfo = luci.util.split(requestUri, "?")
  end
end

--- Dispatch an HTTP request.
-- @param request	LuCI HTTP Request object
function httpdispatch(request, prefix)
    http_request_log(request,"request")
	luci.http.context.request = request

	local r = {}
	context.request = r
	context.urltoken = {}
	
	local youkuinterface = require "luci.youkucloud.youkuinterface"
	local params = youkuinterface.parseparams(request:getenv("REQUEST_URI"))
	
	local fromtype = "web"
	if params.from and params.from ~= "" then
	    fromtype = "app"
	end
		
	if params.to and params.to ~= "" then
	    if fromtype=="web" then
			local result = {}
			result.result = 403
			local errordata = {}
            errordata.desc = "params error !!!"
	        result.error=errordata
			luci.http.write(luci.json.encode(result))
			luci.http.close()
			http_request_log(request,"finished")
			return
		end
		fromtype = "remote"
	end
	
	local result = youkuinterface.checkAnddoing(params)

    local content = ""
    if fromtype == "app" then
	    content = youkuinterface.resultForApp(result)
	elseif fromtype == "remote" then
	    content = youkuinterface.resultForApp(result)
	else
		if params.callback then
			content = params.callback.."("..luci.json.encode(result)..")"
		else
			content = luci.json.encode(result)
		end
	end
    luci.http.header("Content-Length", string.len(content))
	
	if params.op ~= "set" then
	    luci.http.header("Content-Type", "text/plain; charset=utf-8")
	end
    luci.http.write(content)

	luci.http.close()
    http_request_log(request,"finished")
end
