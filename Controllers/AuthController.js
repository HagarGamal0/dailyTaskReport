const Employee = require("../Models/employeeSchema");

exports.loginUser = async function (req, res) {
    try {
      const {name , password} = req.body;
        let user = await Employee.findOne({ name: name });
  

      if(user){ 
        console.log(user.password)
         console.log(password)
          if(JSON.stringify(user.password) == JSON.stringify(password)){
            res.status(200).json(user)
          }else{
            res.status(401).json({ error: "Invalid email or password" });

          }

      }else{
        res.status(401).json({ error: "user not found" });
      }
  
      
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Error logging in user" });
    }
  };
  