from django.shortcuts import render
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder
import time
import random

# Create your views here.
def getToken(request):
    
    appId = "1da13b98752547969aa76946e0bece7d"
    appCertificate ="d159d1ec4f9646b6999d1f7a72222d31"
    channelName = str(random.randint(11111111,99999999))
    uid = random.randint(12342,93131)
    expirationTimeInSeconds = 3600*2
    currentTime = time.time()
    privilegeExpiredTs = currentTime + expirationTimeInSeconds
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)
    return JsonResponse({"token": token,"uid":uid,"roomid":channelName},safe=False)

def lobby(request):
    return render(request, 'base/lobby.html')

def room(request):
    return render(request, 'base/room.html')