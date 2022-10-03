# Test task for NodeJs developer

## Stack

DB: PostgreSQL

Framework: express, nestJS __Depends on job description and experience__

## Description

Implement CRUD for User and Tags entities.

### __User:__

| field | type |
| ------------- |:-----------:|
| id | uid |
| email | string(100) |
| password | string(100) |
| nickname | string(30) |

__password__: must contain at least one digit, one uppercase and one lowercase letter.

__password__: minimum length 8 characters

### __Tag__

| field | type |
| ------------- |:--------------:|
| id | int |
| creator | uid |
| name | string(40) |
| sort order | int default(0) |

__creator__ uid of the user who created the tag, only he can change it and delete it from the database

### __UserTag__

This table needs to be made by yourself

-----

Make a service with REST API and authorization by JWT bearer token.

Set up CORS for access from any origin.

## Mandatory requirements

1) Do not store passwords in clear text
2) Implement field validation on api requests with response codes and error messages in the response body.
3) Deploy the project in any convenient place so that you can run the tests and check.
4) Code on github or gitlab
5) Adhere to the principles of SOLID
6) The authorization token lives for 30 minutes
7) Implement an endpoint to refresh the token
8) Create migrations
9) Write supporting documentation in README.md for spread
10) Implement offset or pagination for the __TAG__ entity
11) Implement Sorting by the __sortOrder__ field and (or) the __name__ field for the __TAG__ entity

## Additional requirements

1) Use DTOs
2) Write interfaces and implement them
3) It is advisable not to use ORM
4) Write a DockerFile for the application
5) Write docker-composer to deploy the application locally
6) Implement caching
7) Cover the api itself with tests
8) Add generation of swagger documentation for api methods (or write it by hand and put it in the /doc directory in the project)

## API endpoint list

`POST /signin`

```json
{
  "email": "example@exe.com",
  "password": "example",
  "nickname": "nickname"
}
```

Validate __password__, __email__, __nickname__

RETURN:

```json
{
  "token": "token",
  "expire": "1800"
}
```

-----

`POST /login`

```json
{
  "email": "example@exe.com",
  "password": "example"
}
```

RETURN:

```json
{
  "token": "token",
  "expire": "1800"
}
```

-----

`POST /logout`
  
HEADER: ```Authorization: Bearer {token}```

### __Below going api are closed under authorization__

`GET /user`

HEADER: ```Authorization: Bearer {token}```

RETURN:

```json
{
  "email": "example@exe.com",
  "nickname": "example",
  "tags": [
    {
      "id": "id",
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

-----

`PUT /user`
  
HEADER: ```Authorization: Bearer {token}```

```json
{
  "email": "example@exe.com",
  "password": "example",
  "nickname": "example"
}
```

All fields are optional

Validate __password__, __email__, __nickname__

Check for duplicate __email__ and __nickname__ in the database

RETURN:

```json
{
  "email": "example@exe.com",
  "nickname": "example"
}
```

-----

`DELETE /user`

HEADER: ```Authorization: Bearer {token}```

Logging out and deleting a user

-----

`POST /tag`
  
HEADER: ```Authorization: Bearer {token}```

```json
{
  "name": "example",
  "sortOrder": "0"
}
```

__sortOrder__ is optional by default 0
Check for duplicate __name__ in the database and the maximum length

RETURN:

```json
{
  "id": "id",
  "name": "example",
  "sortOrder": "0"
}
```

-----

`GET /tag/{id}`

HEADER: ```Authorization: Bearer {token}```

RETURN:

```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```

-----

`GET /tag?sortByOrder&sortByName&offset=10&length=10`

HEADER: ```Authorization: Bearer {token}```

__sortByOrder__, __offset__ __SortByName__, __length__ are optional

__length__ number of elements in the sample

If you chose the page approach, then use the __page__ and __pageSize__ parameters instead of __offset__ and __length__

RETURN:

```json
{
  "data": [
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    },
    {
      "creator": {
        "nickname": "example",
        "uid": "exam-pl-eUID"
      },
      "name": "example",
      "sortOrder": "0"
    }
  ],
  "meta": {
    "offset": 10,
    "length": 10,
    "quantity": 100
  }
}
```

__quantity__ total number of elements in the sample

-----

`PUT /tag/{id}`

HEADER: ```Authorization: Bearer {token}```

The tag can only be changed by the owner

```json
{
  "name": "example",
  "sortOrder": "0"
}
```

__name__ or __sortOrder__ are optional

RETURN:

```json
{
  "creator": {
    "nickname": "example",
    "uid": "exam-pl-eUID"
  },
  "name": "example",
  "sortOrder": "0"
}
```

-----

`DELETE /tag/{id}`

HEADER: ```Authorization: Bearer {token}```

The tag can only be deleted by the owner

Cascade delete all related records with this Tag

-----

`POST /user/tag`

HEADER: ```Authorization: Bearer {token}```

```json
{
  "tags": [1, 2]
}
```

We check the tags for presence in the database and add them to the user in a batch (atomic operation)

Example: If the tag with id 2 is not in the database, then the tag with id 1 will not be added to the user

RETURN:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

-----

`DELETE /user/tag/{id}`

HEADER: ```Authorization: Bearer {token}```

RETURN:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```

-----

`GET /user/tag/my`

HEADER: ```Authorization: Bearer {token}```

We give a list of tags in which the user is the creator

RETURN:

```json
{
  "tags": [
    {
      "id": 1,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 2,
      "name": "example",
      "sortOrder": "0"
    },
    {
      "id": 3,
      "name": "example",
      "sortOrder": "0"
    }
  ]
}
```
