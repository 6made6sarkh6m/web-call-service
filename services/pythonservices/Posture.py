import asyncio
import ssl
import websockets
import cv2
import numpy as np
import json
import datetime as dt
import sys
from tf_pose.estimator import TfPoseEstimator
from tf_pose.networks import get_graph_path, model_wh
import mysql.connector

ssl_context = ssl.SSLContext()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE


async def wsrun(uri):
	i = 0
	async with websockets.connect(uri, ssl=ssl_context) as websocket:
		ifNameRecv = False	
		name = "Null"
		while True:
			i+=1
			
			if ifNameRecv == False:
				name = await websocket.recv()
				ifNameRecv = True
			bufer = await websocket.recv()
			#print(sys.getsizeof(bufer))

			npfst = True
			while npfst:
				try:
					imgBufer = bufer
					bufer = np.fromstring(bufer)
					image = cv2.imdecode(bufer, cv2.IMREAD_COLOR)
					WarningMessage = ""
					humans = e.inference(image, resize_to_default=(w > 0 and h > 0), upsample_size=4.0)
					humanCordinates = []
					image, humanCordinates = TfPoseEstimator.draw_humans(image, humans, imgcopy=False)
					currentTime = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
					if not humanCordinates:
						WarningMessage = "No People"
						#await websocket.send(WarningMessage)
						print(WarningMessage)
					else:
						if (17 not in humanCordinates[0].keys()) or (16 not in humanCordinates[0].keys()):
							WarningMessage = "Turn Head"
							#await websocket.send(WarningMessage)
							print(WarningMessage)
					if WarningMessage != "":
						sql = "INSERT INTO `proct_result` (`time`,`name`,`message`) VALUES (%s,%s,%s);"
						val = ( currentTime, name, WarningMessage)
						mycursor.execute(sql, val)
						mydb.commit()
					npfst = False
				except:
					bufer = bufer + bytes(b'\x00')

			

mydb = mysql.connector.connect(
  host="localhost",
  user="proctoring",
  passwd="123$",
  database="proctoring"
)
mycursor = mydb.cursor()				
w, h = model_wh("432x368")
e = TfPoseEstimator(get_graph_path("mobilenet_thin"), target_size=(w, h), trt_bool=False)				

asyncio.get_event_loop().run_until_complete(
    wsrun('wss://nii-it.kz:2528/face_recognition/handler'))