import argparse
import base64
import httplib2
from apiclient.discovery import build
from oauth2client.client import GoogleCredentials
import pprint
import os.path
import json
import MySQLdb
from time import sleep

def main(photo_file):
  '''Run a label request on a single image'''

  API_DISCOVERY_FILE = 'https://vision.googleapis.com/$discovery/rest?version=v1'
  http = httplib2.Http()

  credentials = GoogleCredentials.get_application_default().create_scoped(
      ['https://www.googleapis.com/auth/cloud-platform'])
  credentials.authorize(http)

  service = build('vision', 'v1', http, discoveryServiceUrl=API_DISCOVERY_FILE)

  with open(photo_file, 'rb') as image:
    image_content = base64.b64encode(image.read())
    service_request = service.images().annotate(
      body={
        'requests': [{
          'image': {
            'content': image_content
           },
          'features': [{
            'type': 'LABEL_DETECTION',
            'maxResults': 5,
           }]
         }]
      })

    response = service_request.execute()
    try:
       data=[]
       for item in response['responses'][0]['labelAnnotations']:
          data.append(item['description'])

       s=","
       return s.join(data)
    except KeyError:
       return False


if __name__ == '__main__':
  db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="",         # your username
                     passwd="",  # your password
                     db="")        # name of the data base
  cur = db.cursor()
  up = db.cursor()
  cur.execute('select id,media from Content where id not in (select id from Content_GoogleVison) and media like \'{"type":"img"%\' order by id desc ')
  for row in cur.fetchall():
     data=json.loads(row[1])
     print data['url']
     sleep(0.5)
     if os.path.isfile(data['url']) is False:
       continue;
     if os.path.getsize(data['url'])>10000000:
       continue;
     res=main(str(data['url']))
     print res
     if res is False:
       res=""
     sql="insert into Content_GoogleVison (id, message) values (%s, %s)"
     cur.execute(sql, (row[0], res))
     db.commit()
  db.close()
