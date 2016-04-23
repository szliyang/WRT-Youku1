#!/bin/sh
#=========================================================
#  Copyright (c) YOUKU, 2015. All rights reserved.
# 
#  @author	David <huangdawei@youku.com>
# 
#  @brief	  
# 
#  Revision History:
#=========================================================

echo "WPS enabled"
light wps blink 1

iwpriv ra0 set WscConfMode=7
iwpriv ra0 set WscConfStatus=2
iwpriv ra0 set WscMode=2
iwpriv ra0 set WscGetConf=1

iwpriv rai0 set WscConfMode=7
iwpriv rai0 set WscConfStatus=2
iwpriv rai0 set WscMode=2
iwpriv rai0 set WscGetConf=1

sleep 10
light wps off

