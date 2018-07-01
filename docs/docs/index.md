# What is Lemni?

Lemni allows us to implement React components and aplications in a **functional and reactive** way, making it much more natural to deal with the asynchronicity of interfaces, as well as isolating side effects away from the logic.

## Embracing Asynchronicity

Think of all the data and events you're used to work with in React, such as props, state, lifecycle, user interaction, etc. These are all asynchronous by nature, the data change and the events emit along time, more than often triggered by previous events and producing new ones. Basicaly what Lemni does is to turn all of this data and events into reactive streams, completely embracing the asynchronicity and allowing us to take advantage of it.

## React Compatible

Lemni is out-of-the-box fully compatible with the entire React ecosistem, including React Native: Lemni components are actual React components.

_**Does it really work with React Native, though?**_

Glad you asked: it does. :)