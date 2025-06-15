export const validateFact = (req , res , next) => {

  if (!req.body.fact || typeof req.body.fact !== 'string') {

    return res.status(400).json({ error: "Fact text is required and must be a string" });

  }

  next();

};


