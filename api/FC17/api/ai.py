from django.http import HttpResponse
from FC17Website.models import User,AI
from FC17 import tools
from FC17.api.notice import DateEncoder
from FC17.settings import BASE_DIR
import os
import time
import json

SUFFIX='.cpp'

def upload(request):
    user = tools.getCurrentUser(request)
    res = {}
    print(request.POST['filename'])
    print(request.POST['description'])
    if user != None and request.method == 'POST' and request.POST.get('filename') and type(request.POST.get('description'))!=type(None):
        #limit the size and type of file to be uploaded
        myfile = request.FILES['file']
        if myfile:
            if myfile.size >= 1048576:
                res['error']=True
                res['message'] = 'Size of file should be less than 1MB.'
            elif myfile.name.endswith(SUFFIX) == False:
                res['error']=True
                res['message'] = 'Only {0} file will be accepted.'.format(SUFFIX)
            else:
                fileupload = AI()
                fileupload.filename = request.POST['filename']
                fileupload.user = user
                fileupload.description = request.POST['description']
                fileupload.file = myfile
                fileupload.save()
                print('Code uploaded. author={0}, name={1}'.format(user.id, fileupload.filename))

                res['error']=False
                res['message'] = 'You have successfully uploaded the code.'
        else:
            res['error']=True
            res['message'] = 'File does not exist.'
    elif user == None:
        res['error'] = True
        res['message'] = 'Please log in.'
    else:
        res['error'] = True
        res['message'] = 'Error'

    return HttpResponse(json.dumps(res), content_type = 'application/json')

def list(request):
    user = tools.getCurrentUser(request)
    res = {}
    if user:
        ai_list = AI.objects.filter(user = user)
        data=[]
        for ai in ai_list:
            #for attr in dir(ai.user):
            #    print(attr+":"+str(getattr(ai.user,attr)))
            data.append({
                'username' : json.loads(ai.user.information)["username"], 
                'filename' : ai.filename, 
                'description' : ai.description, 
                'upload time': ai.timestamp, 
                'ai id':ai.id
            })
        res['data']=data
        res['result']=True
    else:
        res['data']=[]
        res['result']=False
    return HttpResponse(json.dumps(res, cls=DateEncoder), content_type = 'application/json')

def delete(request, pk):
    user = tools.getCurrentUser(request)
    res = {}
    print(pk)
    if user:
        file = AI.objects.filter(id = pk)
        if len(file)==0:
            res['message']='File does not exist.'
            res['result']=False
        elif file[0].user!=user:
            res['message']='You can only delete your own file.'
            res['result']=False
        else:
            file = file[0]
            if os.path.exists(BASE_DIR.replace('\\','/')+'/FC17/media/'+file.path):
                os.remove(BASE_DIR.replace('\\','/')+'/FC17/media/'+file.path)
            file.delete()
            res['message']='success'
            res['result']=True
    else:
        res['message']='Please login first.'
        res['result']=False
    return HttpResponse(json.dumps(res), content_type = 'application/json')