## Inspiration
When we were researching the problems facing farmers in developing countries today, one of the largest issues was a lack of information. Many farmers live without internet access, and are unable to learn about best farming practices, weather updates, or even just current news. However, as evidenced by the rapid rise of mobile banking in places like Africa, it is clear that farmers have access to phone services. We have created a SMS service to help farmers advance their personal education and increase their agricultural productivity.

## What it does
Farmers can subscribe to our SMS service. There are 4 main features to our program.

First, a farmer can inquire about weather forecast by sending "weather 'City Name'''. Our program will reply back with 3 day forecast of the inquired city.

Second, a farmer can inquire about general knowledge by sending "about 'inquiry'". Our program will reply back with a short summary of the information from Wikipedia.   

Third, a farmer can ask for a useful farming fact by by sending "fact". Our program will respond with a random fact about good farming practices.

Fourth, a farmer can inquire about the current news with "news". Our program will reply back with headlines of current news. Furthermore, a farmer can add an additional argument to get more detailed news about a topic.

## How we built it
We used node.js to create a server program that interacts with twilio to allow us to read and respond to sms messages. APIs for OpenWeatherMap, NewsApi.org, and Wikipedia were used to add functionality for our program. Our code is deployed on heroku and can be accessed by sending a text message to 646 759 0422

## Challenges we ran into and What we learned
We formed a team yesterday, did not know our members' backgrounds and skills, and had diverse backgrounds and skills. Initially, collaborating with a diverse background was a challenge, but we learned to adjust and adept to the team quickly. Each of us were willing to contribute to the project even if few of us didn't have background knowledge in Javascript and web programming.


## Accomplishments that we're proud of
We are proud to present a working prototype of SMS service to farmers.

