#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xml.etree.cElementTree as ET
from collections import defaultdict
import re
import pprint
import codecs
import json

OSMFILE = "ulaanbaatar_mongolia.osm"
CREATED = [ "version", "changeset", "timestamp", "user", "uid"]

#pre-compiled regex queries
street_type_re = re.compile(r'\b\S+\.?$', re.IGNORECASE)
lower = re.compile(r'^([a-z]|_)*$')
lower_colon = re.compile(r'^([a-z]|_)*:([a-z]|_)*$')
problemchars = re.compile(r'[=\+/&<>;\'"\?%#$@\,\. \t\r\n]')


expected = ["Street", "Avenue", "Boulevard", "Drive", "Court", "Place", "Square", "Lane", "Road", 
            "Trail", "Parkway", "Commons", "Ring Road"]

street_mapping = {
            "Sq": "Square",
            "Zam": "Road",
            "Toiruu": "Ring Road",
            "toiruu": "Ring Road",
            "PeaceAvenue": "Peace Avenue",
            "UN Street, Sukhbaatar District" : "United Nations Street",
            "UN Street-16, Sukhbaatar District" : "United Nations Street"
            }

building_mapping = {
            u"гэр": "hut",
            "ger": "hut",
            "tent": "hut",
            "yurt": "hut",
            "ger.": "hut",
            "baishin": "house",
            }

postal_code_range = [11000,19000]
postal_code_default = 11000

def audit_street_type(street_types, street_name):
    m = street_type_re.search(street_name)
    if m:
        street_type = m.group()
        if street_type not in expected:
            street_types[street_type].add(street_name)

def audit_postal_code(invalid_postal_codes, postal_code):
    try:
        if not (postal_code_range[0] <= int(postal_code) <= postal_code_range[1]):
            raise ValueError
    except ValueError:
        invalid_postal_codes[postal_code] += 1

def audit_phone_number(invalid_phone_numbers, phone_number):
    try:
        if len(phone_number) != 12 or phone_number[:3] != '+976':
            raise ValueError
    except ValueError:
        invalid_phone_numbers[phone_number] += 1

def is_street_name(elem):
    return (elem.attrib['k'] == "addr:street")

def is_postal_code(elem):
    return (elem.attrib['k'] == "addr:postcode")

def is_phone_number(elem):
    return (elem.attrib['k'] == "phone")

def audit(osmfile):
    osm_file = open(osmfile, "r")
    street_types = defaultdict(set)
    invalid_postal_codes = defaultdict(int)
    invalid_phone_numbers = defaultdict(int)
    for event, elem in ET.iterparse(osm_file, events=("start",)):

        if elem.tag == "node" or elem.tag == "way":
            for tag in elem.iter("tag"):
                if is_street_name(tag):
                    audit_street_type(street_types, tag.attrib['v'])
                elif is_postal_code(tag):
                    audit_postal_code(invalid_postal_codes, tag.attrib['v'])
                elif is_phone_number(tag):
                    audit_phone_number(invalid_phone_numbers, tag.attrib['v'])

    return [invalid_postal_codes, invalid_phone_numbers, street_types]

#standardizes street types with a replacement map
def update_name(name, mapping):
    name = name.split(' ')
    type = name[-1]
    if type in mapping:
        name[-1] = mapping[type]
    
    name = ' '.join(name)
    name = name.title()

    return name

#checks if postal code within valid range, if not replaces with 11000 default
def update_postal_code(postal_code):
    try:
        if not (postal_code_range[0] <= int(postal_code) <= postal_code_range[1]):
            raise ValueError
        else:
            return int(postal_code)
    except ValueError:
        return postal_code_default

#standardizes phone number formatting
def update_phone_number(phone_number):
    phone_number = phone_number.translate(None, ' ()-')
    phone_number = '+976 11 ' + phone_number[-6:]
    return phone_number

#converts building types to lowercase, standardizes with a replacement map
def update_building_type(building_type, mapping):
    building_type = building_type.lower()

    if building_type in mapping:
        building_type = mapping[building_type]

    return building_type

def shape_element(e):
    node = {}
    node['created'] = {}
    node['pos'] = [0,0]
    if e.tag == "way":
        node['node_refs'] = []
    if e.tag == "node" or e.tag == "way" :
        node['type'] = e.tag
        #attributes
        for k, v in e.attrib.iteritems():
            #latitude
            if k == 'lat':
                try:
                    lat = float(v)
                    node['pos'][0] = lat
                except ValueError:
                    pass
            #longitude
            elif k == 'lon':
                try:
                    lon = float(v)
                    node['pos'][1] = lon
                except ValueError:
                    pass
            #creation metadata
            elif k in CREATED:
                node['created'][k] = v
            else:
                node[k] = v
        #children
        for tag in e.iter('tag'):
            k = tag.attrib['k']
            v = tag.attrib['v']
            if problemchars.match(k):
                continue
            elif lower_colon.match(k):
                k_split = k.split(':')
                #address fields
                if k_split[0] == 'addr':
                    k_item = k_split[1]
                    if 'address' not in node:
                        node['address'] = {}
                    #streets
                    if k_item == 'street':
                        v = update_name(v, street_mapping)                    
                    #postal codes
                    if k_item == 'postcode':
                        v = update_postal_code(v)
                    node['address'][k_item] = v
                    continue
            else:                
                #phone numbers
                if(is_phone_number(tag)):
                    v = update_phone_number(v)
                #buildings
                if k == 'building':
                    v = update_building_type(v, building_mapping)
            node[k] = v
        #way children
        if e.tag == "way":
            for n in e.iter('nd'):
                ref = n.attrib['ref']
                node['node_refs'].append(ref);
        return node
    else:
        return None

def process_map(file_in, pretty = False):
    file_out = "{0}.json".format(file_in)
    data = []
    with codecs.open(file_out, "w") as fo:
        for _, element in ET.iterparse(file_in):
            el = shape_element(element)
            if el:
                data.append(el)
                if pretty:
                    fo.write(json.dumps(el, indent=2)+"\n")
                else:
                    fo.write(json.dumps(el) + "\n")
    return data

def audit_report():
    audit_data = audit(OSMFILE)
    pprint.pprint(audit_data[0])
    pprint.pprint(audit_data[1])
    pprint.pprint(dict(audit_data[2]))

'''
PRINT OUT AUDIT REPORT
'''
#audit_report()

'''
PROCESS DATA AND OUTPUT JSON
'''
process_map(OSMFILE, False)