from django.http import HttpResponse
from django.shortcuts import render
from django.shortcuts import redirect
from FC17Website.models import Users
from FC17 import tools
import json


#用于统一页面风格
def mainStyle(request, content = "home.html", context = {}):
	user = request.session.get('User')
	if (user != None):
		user = Users.objects.get(id = user['id'])
		context['User'] = user
		context['UserInformation'] = json.loads(user.information)
	
	return render(request, content, context)

def login(request):
	try:
		del request.session['User']
	except:
		pass
		
	#如果从token和ID成功得到了用户信息，就记录进session
	if (request.POST and request.POST.get('token') and request.POST.get('ID')):
		result, status_code = tools.getUserInfoToken(request.POST['token'], request.POST['ID'])
	elif (request.POST and request.POST.get('username') and request.POST.get('ID') and request.POST.get('password')):
		result, status_code = tools.getUserInfoPassword(request.POST['username'], request.POST['ID'], request.POST['password'])
	
	if (status_code == 200):
		request.session['User'] = result
		user = Users.objects.filter(id = result['id'])
		if (len(user) == 0):
			user = Users(id = result['id'])
		else:
			user = user[0]
		user.information = json.dumps(result)
		user.save()
				
	return redirect("/")




def home(request):
	return mainStyle(request, 'home.html')



def alert(request, output = 'test'):
	context = {}
	context['word'] = json.dumps(output)
	return mainStyle(request, 'alert.html', context)