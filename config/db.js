use admin
db.createUser({"user":"admin","pwd":"admin","roles":[{"role":"userAdminAnyDatabase","db":"admin"}]})

use siphtor_news
db.createUser({"user":"siphtor","pwd":"siphtor123456","roles":[{"role":"dbOwner","db":"siphtor_news"}]})
