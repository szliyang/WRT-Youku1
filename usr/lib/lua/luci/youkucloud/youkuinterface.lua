module ("luci.youkucloud.youkuinterface", package.seeall)

local nixio = require("nixio")
local LuciProtocol = require("luci.http.protocol")
local CommonFunc = require("luci.youkucloud.function")
local json = require("luci.json")
local LuciUtil = require("luci.util")

-- @param url	The url or string which contains x-www-urlencoded form data
function parseparams(url)
  local params = {}
  url=CommonFunc.strtrim(url)
  params = LuciProtocol.urldecode_params(url)
  
  if params.op == "extendop" then
      return params
  end
  
  if params.context==nil and params.op ~= "logout" 
     and params.op ~= "upload" and params.op ~= "reboot" and params.op ~= "reset" 
	 and params.op ~= "pppoestop" and params.op ~= "testspeed" and luci.http.context.request then
      params.context = luci.http.formvalue("context")
  end
  
  if params.context ~= nil and type(params.context) == "string" and string.len(params.context) > 2 then
	  local prefix = string.sub(params.context,1,2)
	  params.context = string.sub(params.context,3)
	  params.context = nixio.bin.b64decode(CommonFunc.strtrim(params.context))
	  if prefix == "11" then
	       local aeslua = require("luci.aeslua")
           local util = require("luci.aeslua.util")
		   params.context = aeslua.APPDecrypt(params.context)
	  end
	  params.context = json.decode(params.context)
  else
      params.context = nil
  end
  return params
end

function checkAnddoing(params)
    local havekey = false
	local result={}
	local errstr = {}
	local ifFunc = require "luci.youkucloud.ifFunc"
	
	if params.op == "extendop" then
	    result=ifFunc.doextend(params)
	    return result
	end
	
	if params.key and params.key ~= "" then
		if checkLoginKey(params.key) == 0 then
		    havekey = true
		else
		    result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4031"])
		    return result
		end
	end
	
	if luci.http.context.request then
	    if not CommonFunc.checkRemoteIP() then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4034"])
		    return result
	    end
	end
	
	if params.context ~= nil and type(params.context) ~= "table" then
	    result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		return result
	end

	if params.op == "login" then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
	    result = ifFunc.login(params.context.context,params.to)
	elseif params.op == "logout" and havekey then
	    result = ifFunc.logout(params.key)
	elseif params.op == "get" then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
		local fromtype = "web"
		if params.from and params.from ~= "" then
			fromtype = "app"
		end
	    result = ifFunc.getRouterInfo(params.context.context, havekey, fromtype)
	elseif params.op == "set" then
	    result = ifFunc.setRouterInfo(params.context, havekey, params.key)
	elseif params.op == "reboot" and havekey then
	    result = ifFunc.reboot()
	elseif params.op == "reset" and havekey then
	    result = ifFunc.reset()
	elseif params.op == "upgrade" and havekey then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
	    result = ifFunc.upgrade(params.context.context)
	elseif params.op == "upload" and havekey then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
	    result = ifFunc.upload(params.context.context)
	elseif params.op == "manage" and havekey then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
	    result = ifFunc.manage(params.context.context)
	elseif params.op == "testspeed" and havekey then
	    if params.context == nil or params.context.context == nil then
	        result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4032"])
		    return result
	    end
	    result = ifFunc.testspeed(params.context.context)
	elseif params.op == "pppoestop" then
	    result = ifFunc.pppoestop()
	else
		if not havekey then
			result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4031"])
		else
		    result=ifFunc.seterrordata(result,ifFunc.ERROR_LIST["4033"])
		end
	end
    
	return result
end

function getuptime()
  local uptime=LuciUtil.exec("cat /proc/uptime")
  local t1,t2 = uptime:match("^(%S+) (%S+)")
  return t1
end

function resultForApp(ret)
   local aeslua = require("luci.aeslua")
   local util = require("luci.aeslua.util")
   return nixio.bin.b64encode(aeslua.APPEncrypt(json.encode(ret)))
end

function loginkey2b64(str)
    if (str ~= nil) then
        str = str:gsub("!", "=")
        str = str:gsub("-", "/")
        str = str:gsub("_", "+")
    end
    return str
end

function b642loginkey(str)
    if (str ~= nil) then
        str = str:gsub("=", "!")
        str = str:gsub("/", "-")
        str = str:gsub("+", "_")
    end
    return str
end

function getsavekey(keystr)
    return string.sub(keystr,5,10)..keystr..string.sub(keystr,9,18)
end

function createLoginKey()
  local keyinfo={}
  keyinfo.pid = CommonFunc.getRouterInitMac()
  keyinfo.uptime = getuptime()
  local aeslua = require("luci.aeslua")
  local util = require("luci.aeslua.util")
  local keystring=nixio.bin.b64encode(aeslua.YKEncrypt(json.encode(keyinfo)))
  keystring = b642loginkey(keystring)

  local s = loadkeylistfile()
  if s then
	  s[getsavekey(keystring)]=keyinfo.uptime
  else
      s = {}
	  s[getsavekey(keystring)]=keyinfo.uptime
  end
  writekeylistfile(s)
  return keystring
end

function checkLoginKey(keystr)
   local ret = -1
   local strlen = string.len(keystr)
   if strlen < 40 or math.mod(strlen,4) ~= 0 then
       return ret
   end
      
   local keyinfo = getsavekey(keystr)
   local s = loadkeylistfile()
   if s and s[keyinfo] ~=nil and s[keyinfo] ~= "" then
	   local activetime = getuptime()
	   if tonumber(activetime) - tonumber(s[keyinfo]) < 21600 then
		   s[keyinfo] = activetime
		   writekeylistfile(s)
		   ret = 0
	   else
		   ret = -2   --timeout
	   end
   else
	   ret = -1 --key error
   end
   return ret
end

function deleteLoginKey(keystr)
   local ret = -1

   local keyinfo = getsavekey(keystr)
   if keyinfo then
       local s = loadkeylistfile()
	   if s and s[keyinfo] ~=nil and s[keyinfo] ~= "" then
		   s[keyinfo] = nil
		   ret = 0
       else
	       ret = -1 --key error
	   end
	   writekeylistfile(s)
   end
   return ret
end

function loadkeylistfile()
  local fd = nixio.open("/tmp/youkudatacache", "r")
    local s = ""
    if fd then
        s = fd:readall() or ""
        fd:close()
    end
	
	if s == "" or s == nil then
	    return nil
	end
	
    return LuciUtil.restore_data(s)
end

function writekeylistfile(tbl)
	local fd = nixio.open("/tmp/youkudatacache", "w")
	local s = LuciUtil.serialize_data(tbl)
    if fd then
        fd:write(s)
        fd:close()
    end
end