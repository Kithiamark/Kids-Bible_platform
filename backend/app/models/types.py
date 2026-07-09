from sqlalchemy import Enum as SQLEnum


def value_enum(enum_cls, name: str | None = None) -> SQLEnum:
    return SQLEnum(
        enum_cls,
        values_callable=lambda obj: [item.value for item in obj],
        name=name or enum_cls.__name__.lower(),
        validate_strings=True,
    )
