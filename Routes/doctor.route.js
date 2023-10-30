const express = require("express");
const doctorRouter = express.Router();
const { doctorModel } = require("../model/doctor.model");

doctorRouter.post("/appointments", async (req, res) => {
  const {
    name,
    image,
    specialization,
    experience,
    location,
    date,
    slots,
    fee,
  } = req.body;
  try {
    const appoinment = new doctorModel({
      name,
      image,
      specialization,
      experience,
      location,
      date,
      slots,
      fee,
    });
    await appoinment.save();
    res.status(200).send({ msg: "Appoinment Fixed" });
  } catch (error) {
    res.status(400).send(error);
  }
});

doctorRouter.get("/", async (req, res) => {
  const { filterBy, sortBy, name } = req.query;
  try {
    const sortValue = sortBy === "asc" ? 1 : -1;
    if (filterBy && !sortBy && !name) {
      const appointments = await doctorModel.find({ specialization: filterBy });
      return res.status(200).json(appointments);
    }
    if (!filterBy && sortBy && !name) {
      const appointments = await doctorModel.find().sort({ date: sortValue });
      return res.status(200).json(appointments);
    }
    if (!filterBy && !sortBy && name) {
      const appointments = await doctorModel.find({
        name: { $regex: name, $options: "i" },
      });
      return res.status(200).json(appointments);
    }
    if (filterBy && sortBy && !name) {
      const appointments = await doctorModel
        .find({
          specialization: filterBy,
        })
        .sort({ date: sortValue });
      return res.status(200).json(appointments);
    }
    if (!filterBy && sortBy && name) {
      const appointments = await doctorModel
        .find({
          name: { $regex: name, $options: "i" },
        })
        .sort({ date: sortValue });
      return res.status(200).json(appointments);
    }
    if (filterBy && !sortBy && name) {
      const appointments = await doctorModel.find({
        name: { $regex: name, $options: "i" },
        specialization: filterBy,
      });
      return res.status(200).json(appointments);
    }
    if (filterBy && sortBy && name) {
      const appointments = await doctorModel
        .find({
          name: { $regex: name, $options: "i" },
          specialization: filterBy,
        })
        .sort({ date: sortValue });
      return res.status(200).json(appointments);
    }
    const appointments = await doctorModel.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).send(error);
  }
});

doctorRouter.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await doctorModel.findByIdAndUpdate({ _id: id }, req.body);
    res.status(200).send({ msg: "Updated successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

doctorRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await doctorModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ msg: "Deleted successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { doctorRouter };
