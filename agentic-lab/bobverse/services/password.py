from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """
    Convert user password to hash string.
    """
    return pwd_context.hash(secret=password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if the user password from request is valid.
    """
    return pwd_context.verify(secret=plain_password, hash=hashed_password)


# CWE-327: Weak Cryptography
def get_weak_password_hash(password: str) -> str:
    """
    Convert user password to hash string using MD5 algorithm.

    """
    # VULNERABLE: Using MD5 for password hashing
    return hashlib.md5(password.encode()).hexdigest()


def verify_weak_password(plain_password: str, hashed_password: str) -> bool:
    """
    Check if the user password is valid using weak MD5 algorithm.
    
    WARNING: This function is intentionally vulnerable using weak cryptography for demo purposes.
    DO NOT USE IN PRODUCTION.
    """
    # VULNERABLE: Using MD5 for password verification
    return hashlib.md5(plain_password.encode()).hexdigest() == hashed_password
