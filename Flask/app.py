from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
from email.message import EmailMessage
import ssl
import smtplib
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding
import datetime
import uuid

app = Flask(__name__)

app.secret_key = 'your secret key'
app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'login'

mysql = MySQL(app)

all = []

@app.route('/login', methods=['POST', 'GET'])
def login():
    data = request.json

    message = []
    if request.method == 'POST' and 'email' in data and 'password' in data:
        username = data['email']
        password = data['password']

        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM accounts WHERE email = %s AND password = %s', (username, password,))

        account = cursor.fetchone()
        if account:
            message = [{
                    "status" : 1,
                    "msg": "Login Succesful"
                }]
        else:
            message= [
                {
                    'status' : 0,
                    'msg': 'Incorrect username/password!'
                }
            ]
    
    print(message)

    return jsonify(message)

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    data = request.json
    msg = []

    username = data['name']
    password = data['password']
    email = data['email']

    print(username, password, email)

    if username and password and email:  
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM accounts WHERE username = %s OR email = %s', (username,email,))
        account = cursor.fetchone()
            
        if account:
            msg = [{
                'msg': 'Account already exists!',
                'status': 0
            }]

        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = [{
                'msg': 'Username must contain only characters and numbers!',
                'status': 0

            }]
            
        else:
            cursor.execute('INSERT INTO accounts VALUES (%s, %s, %s)', (username, email, password,))
            mysql.connection.commit()
            msg = [{
                'msg' : 'You have successfully registered!',
                'status': 1
            }]

    else:
        msg = [{
            'msg' : 'Please fill out the form!',
            'status': 0

        }]

    return jsonify(msg)

@app.route('/emailValidation', methods =['GET', 'POST'])
def emailValidation():
    data = request.json
    email_receiver = data['email']
    email_password='hkeouycvhqcnxzrb'
    email_sender="py26.docplus@gmail.com"

    print(data)
    
    subject='Verification'
    body="OTP: {}".format(data['OTP'])

    en=EmailMessage()
    en['From']=email_sender
    en['To']=email_receiver
    en['Subject']=subject
    en.set_content(body)

    context=ssl.create_default_context()

    msg = []
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(email_sender,email_password)
            smtp.sendmail(email_sender,email_receiver,en.as_string())
    except Exception as e:
        print(e)
        msg = [{
            'msg' : 'Email couldn\'t sent, Please try again',
            'status': 0
        }]
    
    if not msg:
         msg = [{
            'msg' : 'Email sent successfully!',
            'status':  1
        }]
    print(msg)
    return jsonify(msg)


def send_email_attachment(reciever_email, subject, msg, id):
    Sender_Email = "py26.docplus@gmail.com"
    Password = 'hkeouycvhqcnxzrb'

    Reciever_Email = reciever_email

    newMessage = EmailMessage()                         
    newMessage['Subject'] = subject
    newMessage['From'] = Sender_Email                   
    newMessage['To'] = Reciever_Email     

    newMessage.set_content(msg)

    with open("certificate.pem", "rb") as f:
        data = f.read()

    newMessage.add_attachment(data, maintype="application", subtype="octect-stream", filename=f"{id}.pem")
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(Sender_Email, Password)              
        smtp.send_message(newMessage)


def generate_certificate(data, public_key_ = None):

    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    public_key = private_key.public_key()

    builder = x509.CertificateBuilder()
    builder = builder.subject_name(x509.Name([
        x509.NameAttribute(x509.oid.NameOID.COMMON_NAME, data['name']),
    ]))
    builder = builder.issuer_name(x509.Name([
        x509.NameAttribute(x509.oid.NameOID.COMMON_NAME, u'BPKI'),
    ]))
    builder = builder.not_valid_before(datetime.datetime.today() - datetime.timedelta(days=365))
    builder = builder.not_valid_after(datetime.datetime.today() + datetime.timedelta(days=365))
    builder = builder.serial_number(x509.random_serial_number())
    builder = builder.public_key(public_key)
    builder = builder.add_extension(
        x509.SubjectAlternativeName([x509.DNSName(data['ipaddress'])]),
        critical=False
    )
    certificate = builder.sign(
        private_key=private_key,
        algorithm=hashes.SHA256(),
        backend=default_backend()
    )

    # serialize
    certificate_pem = certificate.public_bytes(serialization.Encoding.PEM)

    certificate_hash = "\n".join(certificate_pem.decode('utf-8').split("\n")[1:-2]).replace("\n", "")

    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    public_key_hash = "\n".join(public_key_pem.decode('utf-8"').split("\n")[1:-2]).replace("\n", "")

    certificate_id = str(uuid.uuid4())

    response = [{
        "public_key_hash": public_key_ or public_key_hash,
        "certificate_hash": certificate_hash,
        "certificate_id": certificate_id,
        "status": 1 
    }]
    
    with open("certificate.pem", "wb") as f:
        f.write(certificate_id.encode('utf-8'))
        f.write("\n".encode('utf-8'))
        f.write(certificate_pem)
        f.write(public_key_pem)

    return response


@app.route('/Register', methods = ['POST', 'GET'])
def Register():
    data = request.json

    response = generate_certificate(data)
    print(response)

    send_email_attachment(data['email'], "A new SSL Certificate", "Please find the certifiacte in the below attachment", response[0]["certificate_id"])

    return jsonify(response)


@app.route('/Renew', methods=['POST', 'GET'])
def Renew():
    data = request.json

    # print(data)
    response = generate_certificate(data, data["public_key"])

    return jsonify(response)

@app.route('/Revoke', methods=['POST', 'GET'])
def Revoke():
    data = request.json

    # print(data)

    response = [{
        "public_key_hash": data['public_key'],
        "status": 1
    }]

    return jsonify(response)

@app.route('/sendAttachment', methods=['POST', 'GET'])
def sendAttachment():
    data = request.json

    # print(data)

    send_email_attachment(data['email'], "SSL Certificate is Renewed!", "Please find the certifiacte in the below attachment", data["certificate_id"])

    response = [{
        "msg": "Renewed certificate sent to mail, successfully!",
        "status": 1
    }]

    return jsonify(response)


if __name__ == '__main__':
    app.debug = True 
    app.run()
