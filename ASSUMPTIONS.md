# Assumptions

- Payloads inside launch data return an array of payloads, there is no specific mentions of that, i'm considering the first payload to display, like this, payloads: [{ payload_id: payloadId }].
- Although we can show all the payloads ids but for that we have to change the structure in the method - _launchDataTransform and also in the LaunchItem, where we are expecting a single payloadId

# Still to do

[LIST WHAT IS STILL TO DO HERE]

# Changes to the starter project

- Have used a couple of libraries,
- axios: for better and consistent handling for AJAX calls
- and moment: for handling dates and times seamlessly, it's tested accross multiple browsers, we can use native datetime, but that is kinda time consuming and there are chances to face potential bugs across browsers like Safari (I had faced this in the past.)
- Have restructured LaunchItem component in such a way that all the links are now being iterated and 'LINKS' array contains the link and the label name, just to be more readable and extendable without repeating stuff.
- If there is no launch success, it is considered to be a failed mission.
- Transformed the laundata in componentDidMound instead of render method, since that makes more sense to transform the data as soon as we get the result from the api.
- Would like to change the class components to hooks as that is more readable to me, i always use hooks since they got introcued, and is also recommended by the React community.
