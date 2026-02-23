from app.models.team import Team
from app.models.call import Call
from app.models.audit import AuditLog
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine

# 🔥 Import ALL models so relationships register
from app.models.user import User, UserRole
from app.models.team import Team
from app.models.call import Call
from app.models.audit import AuditLog

from passlib.context import CryptContext

# Create tables
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

db: Session = SessionLocal()

# ==============================
# EMPLOYEE DATA
# ==============================

employees_data = [

User(name="Abinesh Kumar", email="abinesh.kumar179@gmail.com", password=hash_password("Abi@741"), phone="9345611122", role=UserRole.EMPLOYEE),
User(name="Bavani Priya", email="bavani.priya180@yahoo.com", password=hash_password("Bav#852"), phone="9123456677", role=UserRole.EMPLOYEE),
User(name="Charan Raj", email="charan.raj181@outlook.com", password=hash_password("Cha$963"), phone="9784567788", role=UserRole.EMPLOYEE),
User(name="Dharshini Lakshmi", email="dharshini.lakshmi182@gmail.com", password=hash_password("Dha@258"), phone="9567808899", role=UserRole.EMPLOYEE),
User(name="Elavarasan Mani", email="elavarasan.mani183@company.com", password=hash_password("Ela#369"), phone="9876511100", role=UserRole.EMPLOYEE),

User(name="Firoz Khan", email="firoz.khan184@gmail.com", password=hash_password("Fir$456"), phone="9012342211", role=UserRole.EMPLOYEE),
User(name="Gajalakshmi Devi", email="gajalakshmi.devi185@yahoo.com", password=hash_password("Gaj@741"), phone="9234563322", role=UserRole.EMPLOYEE),
User(name="Hari Prasad", email="hari.prasad186@outlook.com", password=hash_password("Har#852"), phone="9456784433", role=UserRole.EMPLOYEE),
User(name="Indrajith Kumar", email="indrajith.kumar187@gmail.com", password=hash_password("Ind$963"), phone="9678905544", role=UserRole.EMPLOYEE),
User(name="Jothika Meena", email="jothika.meena188@company.com", password=hash_password("Jot@258"), phone="9345616655", role=UserRole.EMPLOYEE),

User(name="Kavinesh Raj", email="kavinesh.raj189@gmail.com", password=hash_password("Kav#369"), phone="9123457766", role=UserRole.EMPLOYEE),
User(name="Logeshwari Priya", email="logeshwari.priya190@yahoo.com", password=hash_password("Log$852"), phone="9784568877", role=UserRole.EMPLOYEE),
User(name="Mohanapriya Devi", email="mohanapriya.devi191@outlook.com", password=hash_password("Moh@741"), phone="9567809988", role=UserRole.EMPLOYEE),
User(name="Naren Kumar", email="naren.kumar192@gmail.com", password=hash_password("Nar#963"), phone="9876512233", role=UserRole.EMPLOYEE),
User(name="Oormila Lakshmi", email="oormila.lakshmi193@company.com", password=hash_password("Oor$258"), phone="9012343344", role=UserRole.EMPLOYEE),

User(name="Prabhu Selvam", email="prabhu.selvam194@gmail.com", password=hash_password("Pra@369"), phone="9234564455", role=UserRole.EMPLOYEE),
User(name="Ragavi Priya", email="ragavi.priya195@yahoo.com", password=hash_password("Rag#852"), phone="9456785566", role=UserRole.EMPLOYEE),
User(name="Sathya Narayanan", email="sathya.narayanan196@outlook.com", password=hash_password("Sat$741"), phone="9678906677", role=UserRole.EMPLOYEE),
User(name="Thendral Devi", email="thendral.devi197@gmail.com", password=hash_password("The@963"), phone="9345617788", role=UserRole.EMPLOYEE),
User(name="Ulaganathan Raj", email="ulaganathan.raj198@company.com", password=hash_password("Ula#258"), phone="9123458899", role=UserRole.EMPLOYEE),

User(name="Vidhya Lakshmi", email="vidhya.lakshmi199@gmail.com", password=hash_password("Vid$369"), phone="9784569900", role=UserRole.EMPLOYEE),
User(name="Yuvan Kumar", email="yuvan.kumar200@yahoo.com", password=hash_password("Yuv@741"), phone="9567811011", role=UserRole.EMPLOYEE),
User(name="Zeenath Banu", email="zeenath.banu201@outlook.com", password=hash_password("Zee#852"), phone="9876522122", role=UserRole.EMPLOYEE),
User(name="Aishwarya Devi", email="aishwarya.devi202@gmail.com", password=hash_password("Ais$963"), phone="9012343233", role=UserRole.EMPLOYEE),
User(name="Balamurali Krishna", email="balamurali.krishna203@company.com", password=hash_password("Bal@258"), phone="9234564344", role=UserRole.EMPLOYEE),

User(name="Chitra Lakshmi", email="chitra.lakshmi204@gmail.com", password=hash_password("Chi#369"), phone="9456785455", role=UserRole.EMPLOYEE),
User(name="Dineshwaran Mani", email="dineshwaran.mani205@yahoo.com", password=hash_password("Din$852"), phone="9678906566", role=UserRole.EMPLOYEE),
User(name="Easwar Raj", email="easwar.raj206@outlook.com", password=hash_password("Eas@741"), phone="9345617677", role=UserRole.EMPLOYEE),
User(name="Fathima Noor", email="fathima.noor207@gmail.com", password=hash_password("Fat#963"), phone="9123458788", role=UserRole.EMPLOYEE),
User(name="Gowtham Selvam", email="gowtham.selvam208@company.com", password=hash_password("Gow$258"), phone="9784569899", role=UserRole.EMPLOYEE),
]

# ==============================
# INSERT INTO DATABASE
# ==============================

try:
    for employee in employees_data:
        existing = db.query(User).filter(User.email == employee.email).first()
        if not existing:
            db.add(employee)

    db.commit()
    print("✅ Employees inserted successfully")

except Exception as e:
    print("❌ Error:", e)

finally:
    db.close()