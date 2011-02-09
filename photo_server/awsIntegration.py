import boto
from boto.s3.connection import S3Connection
from boto.s3.key import Key
import hashlib

AWS_ACCESS_KEY_ID = 'AKIAJQ5EWIERMNJBOSMQ'
AWS_SECRET_ACCESS_KEY = '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'

def getFromS3(image, topCaption, bottomCaption):
    print "GET!"
    imgHash = hashlib.md5()
    imgHash.update(image)
    imgHashStr = imgHash.hexdigest()

    sdb = boto.connect_sdb('AKIAJQ5EWIERMNJBOSMQ', 'CxMK3wAZ97lItqozZkNp8AmVoj58/TdrH+ClXNaB')
    domain = sdb.create_domain('memeyourfriends')
    query = "SELECT imgHashPath FROM memeyourfriends where origImgHash = '" + imgHashStr + "' and topCaption = '" + topCaption + "' and bottomCaption = '" + bottomCaption + "' LIMIT 1"
    results = domain.select(query, max_items=1)
    for i in results:#HACK!!!
      return i['imgHashPath']
    return 0




def postToS3(image, originalImage, topCaption, bottomCaption):
    print "POST!"
    conn = S3Connection('AKIAJQ5EWIERMNJBOSMQ', 'CxMK3wAZ97lItqozZkNp8AmVoj58/TdrH+ClXNaB')
    
    imgHash = hashlib.md5()
    imgHash.update(image)
    imgHashStr = imgHash.hexdigest()
 
    origImgHash = hashlib.md5()
    origImgHash.update(originalImage)
    origImgHashStr = origImgHash.hexdigest()

    bucket = conn.create_bucket('memeyourfriends')
    k = Key(bucket)
    key = 'complete/' + imgHashStr  + '.jpg'
    k.key = key
    k.content_type = 'image/jpeg'
    k.set_metadata('top', topCaption)
    k.set_metadata('bot', bottomCaption)
    k.set_contents_from_string(image) 
    
    k2 = Key(bucket)
    key2 = 'raw/' + origImgHashStr + '.jpg'
    k2.key = key2
    k2.content_type = 'image/jpeg'
    k2.set_contents_from_string(originalImage)
    

    

    sdb = boto.connect_sdb('AKIAJQ5EWIERMNJBOSMQ', 'CxMK3wAZ97lItqozZkNp8AmVoj58/TdrH+ClXNaB')
    
    domain = sdb.create_domain('memeyourfriends')
    item = domain.new_item(imgHashStr)
    item['imgHash'] = imgHashStr
    item['imgHashPath'] = key
    item['origImgHash'] = origImgHashStr
    item['origImgHashPath'] = key2
    item['topCaption'] = topCaption
    item['bottomCaption'] = bottomCaption
    
    item.save()


    return key


    
