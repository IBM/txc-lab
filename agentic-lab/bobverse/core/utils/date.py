import datetime


def convert_datetime_to_bobnews(dt: datetime.datetime) -> str:
    return dt.replace(tzinfo=datetime.UTC).isoformat().replace("+00:00", "Z")
