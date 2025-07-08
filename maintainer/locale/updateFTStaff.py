#!/usr/bin/env python
from __future__ import print_function

from Hattrick.Parsers import XMLParser
from Hattrick.CHPP import Client

import sys
import os
import json
import codecs

import xml.etree.ElementTree as ET
if sys.version > '3':
    import urllib.request as urllib
else:
    import urllib2 as urllib

if len(sys.argv) > 1:
    FT_JSON = sys.argv[1]
else:
    FT_JSON = os.path.expanduser('res/staff/foxtrick.json')

if os.environ.get('GITHUB_ACTIONS'):
    CONSUMER_KEY = os.environ.get('CHPP_CONSUMER_KEY')
    CONSUMER_SECRET = os.environ.get('CHPP_CONSUMER_SECRET')
    ACCESS_TOKEN_KEY = os.environ.get('CHPP_ACCESS_TOKEN_KEY')
    ACCESS_TOKEN_SECRET = os.environ.get('CHPP_ACCESS_TOKEN_SECRET')
else:
    from Hattrick.CHPP import Credentials
    from Hattrick.CHPP import AccessToken
    CONSUMER_KEY = Credentials.KEY
    CONSUMER_SECRET = Credentials.SECRET
    ACCESS_TOKEN_KEY = AccessToken.KEY
    ACCESS_TOKEN_SECRET = AccessToken.SECRET

chpp = Client.ChppClient(CONSUMER_KEY, CONSUMER_SECRET)
chpp.setAccessToken((ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET))
session = chpp.getSession()

# parse existing staff
with codecs.open(FT_JSON, mode='rb', encoding='utf-8') as ft_json:
    ft = json.load(ft_json)

# update manager names from CHPP
staff = ft['list']

for person in staff:
    ht_id = person['id']
    resp = chpp.getFile('search', params={'searchType': 2, 'searchID': ht_id})
    dom = ET.fromstring(resp.content)
    result = dict()
    XMLParser.xml_to_python(dom, result)

    container = result['HattrickData']['SearchResults']
    new_name = container['Result']['ResultName'] if 'Result' in container else ''
    if not new_name or new_name.startswith('DEL_'):
        if not person['name']:
            person['name'] = '<>'
        elif not person['name'].startswith('<'):
            person['name'] = f"<{person['name']}>"
        else:
            # already replaced
            pass
    else:
        person['name'] = new_name

# output updated staff file
staff.sort(key=lambda person: person['id'])
ft['list'] = staff

with codecs.open(FT_JSON, mode='wb', encoding='utf-8') as out:
    out.write(XMLParser.python_to_json(ft))
