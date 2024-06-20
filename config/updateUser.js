const User = require("../model/UserModel");


const sendUpdateUser=async function (res,email) {
    // We get the subscription
    const subUser = await User.findOne({email: email});

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

    res.status(200).send({status:200, user:JSON_user});
}


module.exports={sendUpdateUser};