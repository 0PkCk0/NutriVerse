const User = require("../model/UserModel");


const sendUpdateUser=async function (res,ID) {
    // We get the subscription
    const subUser = await User.findById(ID);

    //JSON variable to return to the caller
    const JSON_user = {
        name: subUser.name,
        weight: subUser.weight,
        height: subUser.height,
        age: subUser.age,
        gender: subUser.gender,
        timestap: subUser.timestamp,
        Profession: subUser.Profession,
        subscriptionEndDate: subUser.subscriptionEndDate,
        subscriptionStartDate: subUser.subscriptionStartDate
    };

    // We set the header for returning the JSON variable
    res.setHeader('Content-Type', 'application/json');
    res.json(JSON_user);
}


module.exports={sendUpdateUser};