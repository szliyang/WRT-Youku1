LuaQ    @aeslua.lua           0   
   J      @  Αΐ   Ε   ά IΑI ΒIΒI ΓIΓI ΔIΔ$     	 $A              I $              I IΐE$Α     I $    I IΐF$A    I $    I ^          luci    aeslua    require    luci.aeslua.ciphermode    luci.aeslua.util    AES128 	      AES192 	      AES256 	       ECBMODE 	      CBCMODE 	      OFBMODE 	      CFBMODE 	      pwToKey    encrypt    decrypt 	   YOUKUKEY    #wDsL$S*uK&oiRU) 
   YKEncrypt 
   YKDecrypt    APPKEY    #wHat$S*uP&giRL)    APPEncrypt    APPDecrypt           *    +     Δ   Ζ ΐΐ   @  Τ    Α  Α  T  MAΑ   A E FBΑ \ Υ@ώ   @@Ε  ΖΐΑ   AΑ   ά   Κ    B@  Α  Τ   β@  ή    	      AES192 	        	      string    char 	       sub    byte     +                                                                                     "   "   "   "   "   "   "   )   )   )   )   )   )   )   )   )   *      	   password     *   
   keyLength     *   
   padLength    *      postfix 
         (for index)          (for limit)          (for step)          i             public     5   K    V     @@   BA  B   A  @@   BA  B Α  AA@   A[A @ D  FAΑ Aΐ   Δ ΖΑΑ  ά   B  BB@ ΔΖΒ    
  A  BB@ ΔΖΒΒ   ΐ  C  BB@ ΔΖBΓ     C  BB@ ΔΖΒΓ   @           assert     Empty password.    Empty data.    CBCMODE    AES128    pwToKey    padByteString    ECBMODE    encryptString    encryptECB    encryptCBC    OFBMODE    encryptOFB    CFBMODE    encryptCFB     V   6   6   6   6   6   6   6   7   7   7   7   7   7   7   9   9   9   9   :   :   :   :   <   <   <   <   <   >   >   >   >   @   @   @   @   A   A   A   A   A   A   A   A   A   B   B   B   B   C   C   C   C   C   C   C   C   C   D   D   D   D   E   E   E   E   E   E   E   E   E   F   F   F   F   G   G   G   G   G   G   G   G   G   I   I   K      	   password     U      data     U   
   keyLength     U      mode     U      mode    U   
   keyLength    U      key    U      paddedData    U         public    private    util    ciphermode     V   n    N   A@   @[A @ D  FAΐ @ΐ   Γ  Β@   A@  Δ ΖBΑ ΐ @	  @   A@  Δ ΖΑ ΐ    ΒA   A@  Δ ΖΒ ΐ ΐ  BB ΐ A@  Δ ΖΒ ΐ C@ Β Β @C@   Β          CBCMODE    AES128    pwToKey    ECBMODE    decryptString    decryptECB    decryptCBC    OFBMODE    decryptOFB    CFBMODE    decryptCFB    result    unpadByteString      N   W   W   W   W   X   X   X   X   Z   Z   Z   Z   Z   \   ]   ]   ]   ]   ^   ^   ^   ^   ^   ^   ^   ^   ^   _   _   _   _   `   `   `   `   `   `   `   `   `   a   a   a   a   b   b   b   b   b   b   b   b   b   c   c   c   c   d   d   d   d   d   d   d   d   g   g   g   g   g   i   i   i   j   j   m   m   n      	   password     M      data     M   
   keyLength     M      mode     M      mode    M   
   keyLength    M      key    M      plain    M         public    private    ciphermode    util     q   s       D   F ΐ    @@ΐ     @D  FΑΐ] ^           encrypt 	   YOUKUKEY    AES128    CBCMODE        r   r   r   r   r   r   r   r   r   r   r   s         data              public     u   w       D   F ΐ    @@ΐ     @D  FΑΐ] ^           decrypt 	   YOUKUKEY    AES128    CBCMODE        v   v   v   v   v   v   v   v   v   v   v   w         data              public     z   |       D   F ΐ    @@ΐ     @D  FΑΐ] ^           encrypt    APPKEY    AES128    CBCMODE        {   {   {   {   {   {   {   {   {   {   {   |         data              public     ~          D   F ΐ    @@ΐ     @D  FΑΐ] ^           decrypt    APPKEY    AES128    CBCMODE                                                  data              public 0                                                      *   *      K   K   K   K   K   5   n   n   n   n   n   V   p   s   s   q   w   w   u   y   |   |   z         ~               private    /      public    /      ciphermode    /      util 
   /       