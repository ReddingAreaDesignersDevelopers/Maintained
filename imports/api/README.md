# Dash API

This folder contains declarations, shared on server and client, that describe the types of data used by the dash.

These types of data include clients, properties, and users of the system.

Data conforming to these types are stored in the database. This folder describes how they are to be stored and retrieved.

These types are described via the [Astronomy](http://jagi.github.io/meteor-astronomy/) package, which models data types in Meteor. Most data types extend the GenericDashObject type, which provides some helpers.

Each sub-folder that is capitalized (Client, Credentials) contains information about a type of data that is stored in the database.
