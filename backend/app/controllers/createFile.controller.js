const FileSystem = require("../models/FileSystem.model");
const fs = require("fs");
const path = require("path");

const createFolder = async (req, res) => {
  // #swagger.summary = 'Creates a new folder.'
  /*  #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {$ref: '#/definitions/CreateFolder'}
      }
  */
  try {
    const { name, parentId } = req.body;

    // Path calculation
    let folderPath = "";
    if (parentId) {
      const parentFolder = await FileSystem.findById(parentId);
      if (!parentFolder || !parentFolder.isDirectory) {
        return res.status(400).json({ error: "Invalid parentId" });
      }
      folderPath = `${parentFolder.path}/${name}`;
    } else {
      folderPath = `/${name}`; // Root Folder
    }
    //

    // Physical file creation using fs
    const fullFolderPath = path.join(__dirname, "../../public/uploads", folderPath);
    if (!fs.existsSync(fullFolderPath)) {
      await fs.promises.mkdir(fullFolderPath, { recursive: true });
    } else {
      return res.status(400).json({ error: "File already exists!" });
    }
    //

    const newFile = new FileSystem({
      name,
      isDirectory: false,
      path: folderPath,
      parentId: parentId || null,
    });

    await newFile.save();

    /* #swagger.responses[201] = {
      schema: { $ref: '#/definitions/Folder' },
      } */
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createFolder;
