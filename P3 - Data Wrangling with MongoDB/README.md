#Project 3: OpenStreetMap Data Wrangling with MongoDB
In this project, I use data munging techniques, such as assessing the quality of the data for validity, accuracy, completeness, consistency and uniformity, to clean OpenStreetMap data for [Ulaanbaatar](https://en.wikipedia.org/wiki/Ulan_Bator), capital of Mongolia.

![OpenStreetMap logo](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png)

**Dataset:** [Mapzen metro extract XML](https://s3.amazonaws.com/metro-extracts.mapzen.com/ulaanbaatar_mongolia.osm.bz2)

##1. Data audit
Before converting the OpenStreetMap XML into JSON format for inport into MongoDB, I audited the data for incosistencies and other problematic data. Below are some of the issues I came across, and the solutions I resorted to.

###Street name inconsistencies
The dataset presented a number of inconsistencies in names of strets and other thoroughfares:
* Abbreviations
  * Sq > Square
* Lowecase
  * street > Street
* Mongolian names
  * Zam > Road
  * Toiruu > Ring Road
* Space omission
  * PeaceAvenue > Peace Avenue

These were corrected using the following replacement map:
```
{
    "Sq": "Square",
    "Zam": "Road",
    "Toiruu": "Ring Road",
    "toiruu": "Ring Road",
    "PeaceAvenue": "Peace Avenue",
}
```

Then converted into title case with `name = name.title()`.

The United Nations Street mistakenly included the name of the district, which was corrected using the following replacement map:

```
{
"UN Street, Sukhbaatar District" : "United Nations Street",
"UN Street-16, Sukhbaatar District" : "United Nations Street"
}
```

Finally, some `addr:street` fields were mistakenly used for duureg and khoroo, administrative divisions of the Mongolian capital. The invalid tags have been omitted.

###Invalid postal codes
Valid Ulaanbaatar postal codes fall within the 11xxx-19xxx range. The audit of OpenStreetMap data found that many contributors mistakenly input the city's telephone country code (+976) in the postal code field instead.

These and other invalid postal codes were replaced with 11000, the default postal code of Ulaanbaatar.

###Malformatted phone numbers
The audit showed that there is very little consistency in how phone numbers are formatted in the dataset. Some include the country code, some include just the city's area code, and some don't include either. Some prefix it with a + sign, some don't. Some are separates with spaces, some with hyphens. Some are separated in groups of 3 digits, others in groups of 2 and 6.

I standardized the phone number formatting by first removing all spaces, hyphens and parenthesis, then appending the last 6 digits to the country code (+976) and area code (11) separated with spaces. Ex.: `976(11)324-523` > `+976 11 324523`

```
phone_number = phone_number.translate(None, ' ()-')
phone_number = '+976 11 ' + phone_number[-6:]
```

###Building type inconsistencies
The dataset presented a great number of inconsistencies in naming of building types. Most commonly, these inconsistencies involved gers—traditional Mongolian mobile dwellings. I converted all building types to lowercase, and used the following replacement map to fix some of the common misnomers:

```
{
    u"гэр": "hut", #unicode
    "ger": "hut",
    "tent": "hut",
    "yurt": "hut",
    "ger.": "hut",
    "baishin": "house"
}
```

The `ger` building type has been converted into the standard [Key:building](http://wiki.openstreetmap.org/wiki/Key:building) type `hut` reserved for `small and crude shelter`.

##2. Overview of the data

###File size

```
ulaanbaatar_mongolia.osm         118 MB
ulaanbaatar_mongolia.osm.json    140 MB
```

number of unique users
number of nodes and ways
number of chosen type of nodes, like cafes, shops etc

###Dataset size
```
> db.osm_ub.find().count()                                                
653629
```

###Dataset composition
```
> db.osm_ub.find({'type':'node'}).count()                                                
583001

> db.osm_ub.find({'type':'way'}).count()                                                
70597
```

###Dataset contributors
```
> db.osm_ub.distinct('created.user').length
399

> db.osm_ub.aggregate([{
>                         $group:{
>                               '_id':'$created.user'
>                             , 'count':{$sum:1}
>                          }
>                      }, {
>                         $sort:{'count':-1}
>                      }, {
>                         $limit:1
>                      }])
{"_id" : "tmaybe", "count" : 83253 }

> db.osm_ub.aggregate([{
>                         $group:{
>                               '_id':'$created.user'
>                             , 'count':{$sum:1}
>                         }
>                      },{
>                         $group:{
>                               '_id':'$count'
>                             , 'num_users':{$sum:1}
>                          }
>                      },{
>                         $sort:{
>                               '_id':1
>                          }
>                      },{
>                         $limit:1
>                     }])
{"_id" : 1, "num_users" : 62}
```

##3. Additional thoughts and ideas
###Dominant building types
```
> db.osm_ub.aggregate([{
>                         $match: {
>                             'building': {$exists: 1}
>                         }
>                      }, {
>                         $group: {
>                             '_id': '$building'
>                           , 'count': {$sum: 1}
>                         }
>                      }, {
>                         $sort: {'count': -1}
>                      }, {
>                         $limit: 5
>                      }])

{
    "_id" : "yes", //default OSM value for Key:building
    "count" : 31855.
}, 
{
    "_id" : "hut", //mostly traditional gers/yurts
    "count" : 8862.
}, 
{
    "_id" : "house",
    "count" : 872.
}, 
{
    "_id" : "apartments",
    "count" : 227.
}, 
{
    "_id" : "garages",
    "count" : 59.
}
```

A very large number of buildings in the dataset are gers (traditional Mongolian huts). Although most residents of the capital, including those living in gers, are not nomadic, the structure remains intrinsically mobile. I would thus expect that many of the ger locations in the dataset are outdated, especially compared to more permanent building types such as houses.

It would be an interesting project to introduce cheap GPS locators in Mongolia as a means of constantly updating ger locations in OSM, governmental databases, as well as to simplify delivery of mail in remote areas.

Such a project may cause privacy concerns, but is arguably not unlike a regular cadastre in other countries. The cost should equally be acceptable given the low price of GPS receivers, low population of the country, and most importantly the considerable benefits resulting from its implementation.
