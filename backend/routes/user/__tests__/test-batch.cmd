npm run serve

newman run routes/user/__tests__/AddingMentee.postman_collection.json --delay-request 100
newman run routes/user/__tests__/AddingMentors.postman_collection.json --delay-request 100
newman run routes/user/__tests__/MenteeWorkFlow.postman_collection.json --delay-request 100