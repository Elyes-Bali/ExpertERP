import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// CREATE or UPDATE company
export const upsertCompany = async (req, res) => {
  try {
    const {
      name,
      taxNumber,
      website,
      phone,
      country,
      region,
      addressLine,
      zipCode,
    } = req.body;

    let imageUrl = null;
    let qrImageUrl = null;

    // 📸 Upload image to Cloudinary
    if (req.files?.image?.[0]) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "company_images" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(req.files.image[0].buffer);
      });

      imageUrl = uploadResult.secure_url;
    }
    // 📸 Upload QR IMAGE
    if (req.files?.qrImage) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "company_qr" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        stream.end(req.files.qrImage[0].buffer);
      });

      qrImageUrl = uploadResult.secure_url;
    }

    // Check if company already exists
    let company = await Company.findOne({ user: req.userId });

    if (company) {
      // 🔄 UPDATE
      company.name = name;
      company.taxNumber = taxNumber;
      company.website = website;
      company.phone = phone;
      company.address = {
        country,
        region,
        addressLine,
        zipCode,
      };

      if (imageUrl) company.image = imageUrl;
      if (qrImageUrl) company.qrImage = qrImageUrl;

      await company.save();
    } else {
      // 🆕 CREATE
      company = await Company.create({
        user: req.userId,
        name,
        taxNumber,
        website,
        phone,
        image: imageUrl,
        qrImage: qrImageUrl,
        address: {
          country,
          region,
          addressLine,
          zipCode,
        },
      });

      // link to user
      await User.findByIdAndUpdate(req.userId, {
        company: company._id,
      });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    console.error("Company error:", error);
    res.status(500).json({ message: "Error saving company" });
  }
};

// GET company
// export const getMyCompany = async (req, res) => {
//   try {
//     const company = await Company.findOne({ user: req.userId });

//     if (!company) {
//       return res.status(404).json({ message: "No company found" });
//     }

//     res.status(200).json(company);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching company" });
//   }
// };

export const getMyCompany = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.company) {
      return res.status(404).json({ message: "No company found" });
    }

    const company = await Company.findById(user.company);

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company" });
  }
};
