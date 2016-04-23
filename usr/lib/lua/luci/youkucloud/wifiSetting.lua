module ("luci.youkucloud.wifiSetting", package.seeall)

local commonConfig = require("luci.youkucloud.config")
local CommonFunc = require("luci.youkucloud.function")
local Firewall = require("luci.model.firewall")
local LuciNetwork = require("luci.model.network")
local LuciUtil = require "luci.util"
local uci = require "luci.model.uci"
local LuciUci = uci.cursor()
local LuciOS = require("os")

function wifiNetworks()
    local result = {}
    local network = LuciNetwork.init()
    local dev
    for _, dev in ipairs(network:get_wifidevs()) do
        local rd = {
            up       = dev:is_up(),
            device   = dev:name(),
            name     = dev:get_i18n(),
            networks = {}
        }
        local wifiNet
        for _, wifiNet in ipairs(dev:get_wifinets()) do
            rd.networks[#rd.networks+1] = {
                name       = wifiNet:shortname(),
                up         = wifiNet:is_up(),
                mode       = wifiNet:active_mode(),
                ssid       = wifiNet:active_ssid(),
                bssid      = wifiNet:active_bssid(),
                encryption = wifiNet:active_encryption(),
                frequency  = wifiNet:frequency(),
                channel    = wifiNet:channel(),
                signal     = wifiNet:signal(),
                quality    = wifiNet:signal_percent(),
                noise      = wifiNet:noise(),
                bitrate    = wifiNet:bitrate(),
                ifname     = wifiNet:ifname(),
                assoclist  = wifiNet:assoclist(),
                country    = wifiNet:country(),
                txpower    = wifiNet:txpower(),
                txpoweroff = wifiNet:txpower_offset(),
                key	   	   = wifiNet:get("key"),
                key1	   = wifiNet:get("key1"),
                encryption_src = wifiNet:get("encryption"),
                hidden = wifiNet:get("hidden"),
                txpwr = wifiNet:txpower()
            }
        end
        result[#result+1] = rd
    end
    return result
end

function wifiNetwork(wifiDeviceName)
    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(wifiDeviceName)
    if wifiNet then
        local dev = wifiNet:get_device()
        if dev then
            return {
                id         = wifiDeviceName,
                name       = wifiNet:shortname(),
                up         = wifiNet:is_up(),
                mode       = wifiNet:active_mode(),
                ssid       = wifiNet:active_ssid(),
                bssid      = wifiNet:active_bssid(),
                encryption = wifiNet:active_encryption(),
                encryption_src = wifiNet:get("encryption"),
                frequency  = wifiNet:frequency(),
                channel    = wifiNet:channel(),
                signal     = wifiNet:signal(),
                quality    = wifiNet:signal_percent(),
                noise      = wifiNet:noise(),
                bitrate    = wifiNet:bitrate(),
                ifname     = wifiNet:ifname(),
                assoclist  = wifiNet:assoclist(),
                country    = wifiNet:country(),
                txpower    = wifiNet:txpower(),
                txpoweroff = wifiNet:txpower_offset(),
                key        = wifiNet:get("key"),
                key1	   = wifiNet:get("key1"),
                hidden     = wifiNet:get("hidden"),
                txpwr = wifiNet:txpower(),
                device     = {
                    up     = dev:is_up(),
                    device = dev:name(),
                    name   = dev:get_i18n()
                }
            }
        end
    end
    return {}
end

function _wifiNameForIndex(index)
    local devid,softid = CommonFunc.getRouterDevAndSoftID()
	if devid == "002" then
	    if index == 1 then
			return "mt7620.network1"
		end
		if index == 2 then
			return "mt7620.network2"
		end
		
	    if index == 3 then
	        return "mt7612.network1"
	    end
	
		if index == 4 then
			return "mt7612.network2"
		end
	elseif devid == "003" then
	    if index == 1 then
			return "mt7603e.network1"
		end
		if index == 2 then
			return "mt7603e.network2"
		end
		
	    if index == 3 then
	        return "mt7612e.network1"
	    end
	
		if index == 4 then
			return "mt7612e.network2"
		end
	else
	    if index == 1 then
			return "mt7620.network1"
		end
		if index == 2 then
			return "mt7620.network2"
		end
		
	    if index == 3 then
			return "mt7612.network1"
		end
		
		if index == 4 then
			return "mt7612.network2"
		end
	end
    return "mt7620.network1"
end

function wifi_5G_exist()
    local devid,softid = CommonFunc.getRouterDevAndSoftID()
	local devcan = false
	
	if devid == "002" or devid == "003" then
	    devcan = true
	end
	
    local network = LuciNetwork.init()
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(3),".")[1])
    if wifiDev and devcan then
        return true
    else
        return false
    end
end

function getWifiTxpwr(wifiIndex)
    local network = LuciNetwork.init()
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1])
    if wifiDev and wifiDev:get("txpower") ~= nil then
        return tostring(wifiDev:get("txpower"))
    else
        return nil
    end
end

function setWifiTxpwr(wifiIndex, txpwr)
    if CommonFunc.isStrNil(txpwr) then
	    return false
    end
    txpwr = tostring(tonumber(txpwr))
    local network = LuciNetwork.init()
    local LuciUtil = require("luci.util")
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1])
    if wifiDev then
        wifiDev:set("txpower",txpwr);
    end
    
    network:commit("wireless")
    network:save("wireless")
	
	if wifiIndex == 1 then
        LuciOS.execute("sleep 1 && "..commonConfig.SET_TXPWR..txpwr.." >/dev/null 2>/dev/null & ")
	elseif wifiIndex == 3 then
	    LuciOS.execute("sleep 1 && "..commonConfig.SET_TXPWR_5G..txpwr.." >/dev/null 2>/dev/null & ")
	end
    return true
end

function getTxpwrMode(wifiIndex)
    local mode = getWifiTxpwr(wifiIndex)
    if CommonFunc.isStrNil(mode) then
        return "2"
    else
			if tonumber(mode) >= 0 and tonumber(mode) <= 60 then
			    return "0"
			elseif tonumber(mode) > 60 and tonumber(mode) <= 90 then
			    return "1"
			else
			    return "2"
			end
    end
end

function setTxpwrMode(wifiIndex,mode)
    local txpwr = commonConfig.TXPOWER_BASE
    if CommonFunc.isStrNil(mode) then
        txpwr = commonConfig.TXPOWER_BASE
    else
			if mode == "0" then
			    txpwr = commonConfig.TXPOWER_GREEN
			elseif mode == "1" then
			    txpwr = commonConfig.TXPOWER_BASE
			elseif mode == "2" then
		      txpwr = commonConfig.TXPOWER_STRONG
			end
    end
    setWifiTxpwr(wifiIndex,txpwr)
    return true
end

function setWifiBasicInfo(wifiIndex, ssid, password, encryption, channel, txpwr, hidden, on)	
	local network = LuciNetwork.init()
    local LuciUtil = require("luci.util")
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1])
    if CommonFunc.isStrNil(wifiNet) then
        return "false"
    end
    if wifiDev then
        if not CommonFunc.isStrNil(channel) then
            if tonumber(channel) > 0 then
              wifiDev:set("channel", channel)
              wifiDev:set("autoch", 0)
			  if wifiIndex == 1 then
				  LuciOS.execute(commonConfig.SET_CHANNAL..tostring(tonumber(channel)).." >/dev/null 2>/dev/null & ")
			  else
				  LuciOS.execute(commonConfig.SET_CHANNAL_5G..tostring(tonumber(channel)).." >/dev/null 2>/dev/null & ")
			  end
            else
              wifiDev:set("channel", "auto")
              wifiDev:set("autoch", 2)
			  if wifiIndex == 1 then
				  LuciOS.execute(commonConfig.SET_CHANNAL.."0 >/dev/null 2>/dev/null & ")
				  LuciOS.execute("iwpriv ra0 set AutoChannelSel=2 >/dev/null 2>/dev/null & ")
			  else
				  LuciOS.execute(commonConfig.SET_CHANNAL_5G.."0 >/dev/null 2>/dev/null & ")
				  LuciOS.execute("iwpriv rai0 set AutoChannelSel=2  >/dev/null 2>/dev/null & ")
			  end
            end
        end
		
        if not CommonFunc.isStrNil(txpwr) then
	        txpwr = tostring(tonumber(txpwr))
            wifiDev:set("txpower",txpwr);
			if wifiIndex == 1 then
	            LuciOS.execute(commonConfig.SET_TXPWR..txpwr.." >/dev/null 2>/dev/null & ")
			else
			    LuciOS.execute(commonConfig.SET_TXPWR_5G..txpwr.." >/dev/null 2>/dev/null & ")
			end
        end
        if not CommonFunc.isStrNil(on) then
            if on ==  "true" or on == "1" then
                wifiDev:set("disabled", "0")
                wifiNet:set("disabled", nil)
            elseif on == "false" or on == "0" then
                wifiDev:set("disabled", "1")
                wifiNet:set("disabled", nil)
            end
        end
    end

    if not CommonFunc.isStrNil(ssid) and CommonFunc.checkSSID(ssid) then
        wifiNet:set("ssid",ssid)
        wifiNet:set("encryption",encryption)
	    wifiNet:set("key",password)
    end
    
    if not CommonFunc.isStrNil(hidden) then
		if hidden == "true" or hidden == "1" then
			wifiNet:set("hidden","1")
		end
		if hidden == "false" or hidden == "0" then
			wifiNet:set("hidden","0")
		end
    end
    
    network:save("wireless")
    network:commit("wireless")
    return "true"
end

function getWifiBasicInfo(wifiIndex)
    local devname = LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1]
	local netname = "ra0"
	if wifiIndex == 3 then
	    netname = "rai0"
	end
	local result = {signalpath="0", hidden="false",status="true",name="",pwd="",strengthmode="2"}
	
	LuciUci:foreach("wireless","wifi-device",                                  
        function(s)                                                     
            if s ~= nil and s.type == devname then
			    if s.channel == "auto" then
				    result.signalpath = "0"
				else
                    result.signalpath = s.channel
				end
				
				if s.hidden ~= nil and s.hidden == "1"then
					result.hidden = "true"
				end
				
				if s.disabled ~= nil and s.disabled == "1" then
				    result.status = "false"
				end
				if s.txpower ~= nil then
				    if tonumber(s.txpower) >= 0 and tonumber(s.txpower) <= 60 then
			            result.strengthmode = "0"
			        elseif tonumber(s.txpower) > 60 and tonumber(s.txpower) <= 90 then
			            result.strengthmode = "1"
			        else
			            result.strengthmode = "2"
			        end
			    end
            end                                                    
        end                                                             
    )
	
	LuciUci:foreach("wireless","wifi-iface",                                  
        function(s)                                                     
            if s ~= nil and s.ifname == netname then
			    result.name = s.ssid
				result.pwd = s.key
				
				if s.hidden ~= nil and s.hidden == "1"then
					result.hidden = "true"
				end
				
            end
			
			if wifiIndex == 1 then
			    result.guestMode = "false"
			    if s ~= nil and s.ifname == "ra1" then
			        result.guestSSID = s.ssid
					if result.status == "false" or s.disabled == "1" then
						result.guestMode = "false"
					else
						result.guestMode = "true" 
					end
                end
			end
        end                                                             
    )
	return result
end

function _getWifiBasicInfo(wifiIndex)
    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1])
    local result = {}
	if wifiNet == nil then
        return result
    end
    result["type"] = 0
    if wifiDev then
        if  wifiDev:get("channel") == "auto" or tonumber(wifiDev:get("channel")) == 0 then
            result["signalpath"] = 0
        else
            result["signalpath"] = wifiDev:get("channel")
        end
 
        if wifiNet:get("hidden") == "1" then
	    result["hidden"] = "true"
        else
            result["hidden"] = "false"   
	end
        local disable = wifiDev:get("disabled")
        if not CommonFunc.isStrNil(disable) and disable == "1" then
            result["status"] = "false" 
        else
            result["status"] = "true" 
        end
        result["name"] = wifiNet:active_ssid()
        result["pwd"] = wifiNet:get("key")
    end
	
	if wifiIndex == 1 then
	    if result["status"] == "true" then
            result["guestMode"] = getGuestMode()
		else
		    result["guestMode"] = "false" 
		end
	    result["guestSSID"] =  getGuestSSID()
	end
    result["strengthmode"] =  getTxpwrMode(wifiIndex)
    return result
end

function getWifiSimpleInfo(wifiIndex)
    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local result = {}
	if wifiNet == nil then
        result["name"] = ""
		result["pwd"] = ""
		return result
    end
    
    result["name"] = wifiNet:active_ssid() or ""
    result["pwd"] = wifiNet:get("key") or ""
    return result
end

function getGuestMode()
     local network = LuciNetwork.init()
     local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(1),".")[1])
     local wifiNet2 = wifiDev:get_wifinets()[2]
     if wifiNet2 then
        local disable = wifiNet2:get("disabled")
        if not CommonFunc.isStrNil(disable) and disable == "1" then
            return "false"
        else
            return "true"
        end
     else
          return "false"
     end
end

function getGuestSSID()
    local network = LuciNetwork.init()
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(1),".")[1])
    local wifiNet2 = wifiDev:get_wifinets()[2]
    if wifiNet2 then
	    return wifiNet2:active_ssid() or ""
	end
	return ""
end

function getWifiStatus(wifiIndex)
    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(wifiIndex),".")[1])
    if wifiNet == nil then
        return false
    end
    local result = "false"
    if wifiDev then
        local disable = wifiDev:get("disabled")
        if not CommonFunc.isStrNil(disable) and disable == "1" then
            result = "false"
        else
            result = "true" 
        end
    end
    return result
end


--[[
Turn on wifi
@return boolean
]]--
function turnWifiOn(wifiIndex)
    local wifiStatus = getWifiStatus(wifiIndex)
    if wifiStatus == "true" then
        return true
    end
    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local dev
    if wifiNet ~= nil then
        dev = wifiNet:get_device()
    end
    if dev and wifiNet then
        dev:set("disabled", "0")
        wifiNet:set("disabled", nil)
        network:commit("wireless")
        return true
    end
    return false
end

--[[
Turn off wifi
@return boolean
]]--
function turnWifiOff(wifiIndex)
    local wifiStatus = getWifiStatus(wifiIndex)
    if wifiStatus == "false" then
        return true
    end

    local network = LuciNetwork.init()
    local wifiNet = network:get_wifinet(_wifiNameForIndex(wifiIndex))
    local dev
    if wifiNet ~= nil then
        dev = wifiNet:get_device()
    end
    if dev and wifiNet then
        dev:set("disabled", "1")
        wifiNet:set("disabled", nil)
        network:commit("wireless")
        --CommonFunc.forkRestartWifi()
        return true
    end
    return false
end

function setGuestModeOn()
    local samplewifiinfo = getWifiSimpleInfo(1)
	--get wifi name
	local ssidtmp = samplewifiinfo["name"] 
    local ssidname = ""
    if ssidtmp ~= "" and string.len(ssidtmp) >= 1 and string.len(ssidtmp) < 25 then
        ssidname = ssidtmp.."_Guest"
    elseif ssidtmp ~= "" and string.len(ssidtmp) >=25 then
	    ssidname = string.sub(ssidtmp, 1, 24).."_Guest"
	else
        ssidname = "Youku_Router_Guest"
    end
	
    local network = LuciNetwork.init()
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(1),".")[1])
    local wifiNet2 = wifiDev:get_wifinets()[2]
    if wifiNet2 then
        local disable = wifiNet2:get("disabled")
		wifiNet2:set("ssid",ssidname)
        if not CommonFunc.isStrNil(disable) and disable == "1" then
		    wifiNet2:set("disabled", "0")
			wifiNet2:set("hidden","0")			
        elseif not CommonFunc.isStrNil(disable) and disable == "0" then
		    wifiNet2:set("hidden","0")
        end
		network:save("wireless")
        network:commit("wireless")
		--LuciOS.execute(commonConfig.GUEST_MODE_UP)
        return 
    end
  
  local LuciUtil = require("luci.util")
  local interface = "public"
  
  local restartflg = 0
  if not CommonFunc.isExistNetworkPublic() then
      addPublicNetwork()
	  restartflg = 1
  end
  
  local wifiwork = {ifname = "ra1", 
	 ssid = ssidname,
	 mode = "ap",
	 encryption = "none", 
	 network = interface,
	 disabled = "0"}
  wifiDev:add_wifinet(wifiwork)
  network:save("wireless")
  network:commit("wireless")
 
  if restartflg == 1 then
      --restart all
      LuciOS.execute(commonConfig.FORK_RESTART_ROUTER)
  end
  return
end

function addPublicNetwork()
  local network = LuciNetwork.init()
  local LuciUtil = require("luci.util")
  local interface = "public"
  
  --setting network
  network:del_network(interface)
  local lanNet = network:add_network(
            interface, {
                proto   = "static",
                ipaddr  = "192.168.215.1",
                netmask = "255.255.255.0",
                ifname  = "eth0.3",
                type    = "bridge"
            })
  network:save("network")
  network:commit("network")
  
  --setting dhcp
  local uciCursor  = uci.cursor()
  local dhcpvalue = {interface=interface, start="100", limit="100", leasetime="12h"}
  uciCursor:delete("dhcp", interface)
  uciCursor:section("dhcp","dhcp",interface, dhcpvalue)
  uciCursor:save("dhcp")
  uciCursor:commit("dhcp")
  
  --setting firewall
  local firewall = Firewall.init()
  local newzone = firewall:add_zone(interface)
  if newzone ~= nil then
      newzone:add_network(interface)
      newzone:add_forwarding_to("wan")
  end
  firewall:save("firewall")
  firewall:commit("firewall")
end

function getNewLanGateway(langateway, wangateway)
    local newgateway = "192.168.215.1"
	local lanipexp = "0"
	local wanipexp = "0"
	if not CommonFunc.isStrNil(langateway) then
	    lanipexp = LuciUtil.split(langateway,".")[3] or "0"
	end
	
	if not CommonFunc.isStrNil(wangateway) then
	    wanipexp = LuciUtil.split(wangateway,".")[3] or "0"
	end
	
	if lanipexp == "215" or wanipexp == "215" then	    
        local ipexp = tonumber(lanipexp) + tonumber(wanipexp) - 214
		if ipexp ~= 215 and ipexp < 255 then
		    newgateway = "192.168."..tostring(ipexp)..".1"
		else
		    newgateway = "192.168.210.1"
		end		
	end
    return newgateway
end

function checkIfname(ifname)
    local cmd = "ifconfig "..ifname
	local LuciUtil = require("luci.util")
	local info = LuciUtil.exec(cmd)
	local ipmac = info:match('HWaddr (%S+)') or ""
	if ipmac ~= "" then
	    return false
	end
    return true
end

function setGuestModeOff()
    local network = LuciNetwork.init()
    local wifiDev = network:get_wifidev(LuciUtil.split(_wifiNameForIndex(1),".")[1])
    local wifiNet2 = wifiDev:get_wifinets()[2]
    if wifiNet2 then
        local disable = wifiNet2:get("disabled")
        if not CommonFunc.isStrNil(disable) and disable == "1" then
		    wifiNet2:set("hidden","1")
            network:commit("wireless")
            return 
        elseif not CommonFunc.isStrNil(disable) and disable == "0" then
		    wifiNet2:set("disabled", "1")
			wifiNet2:set("hidden","1")
            network:commit("wireless")
            return
        end
    end
	return
end

function getWanIPMac()
	local ifconfig1 = LuciUtil.exec("ifconfig eth0.2 2>/dev/null")
	local ifconfig2 = LuciUtil.exec("ifconfig pppoe-wan 2>/dev/null")
    
	local ip1,ip2,mac1,mac2
	if ifconfig1 ~= nil then
	    ip1 = ifconfig1:match('inet addr:(%S+)')
	    mac1 = ifconfig1:match('HWaddr (%S+)')
	end
	
	if ifconfig2 ~= nil then
        ip2 = ifconfig2:match('inet addr:(%S+)')
	    mac2 = ifconfig2:match('HWaddr (%S+)')
	end
    return ip1 or ip2 or "0.0.0.0", mac1 or mac2 or "00:00:00:00:00:00"
end

function getLanIPGateway()
    local ipinfo = LuciUtil.exec("ip route show | grep br-lan | grep src")
    local result = {}
    if ipinfo then
       result["gateway"] = ipinfo:match('src (%S+)') or "0.0.0.0"
       result["ip"] = ipinfo:match('src (%S+)') or "0.0.0.0"
    else
       result["gateway"] = "0.0.0.0"
       result["ip"] = "0.0.0.0"
    end
    return result
end

function getWanIPGateway()
    local ipinfo = LuciUtil.exec("ip route show")
    local result = {}
    if ipinfo then
       result["gateway"] = ipinfo:match('default via (%S+) dev eth0.2') or ""
       if result["gateway"] == "" then
	       result["gateway"] = ipinfo:match('default via (%S+)') or "0.0.0.0"
		   result["ip"] = ipinfo:match('wan  src (%S+)') or "0.0.0.0"
	   else
	       result["ip"] = ipinfo:match('eth0.2  src (%S+)') or "0.0.0.0"
	   end
       
    else
       result["gateway"] = "0.0.0.0"
       result["ip"] = "0.0.0.0"
    end
    return result
end
