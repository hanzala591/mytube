import fs from "fs";
const deletingFile = (filePath) => {
  fs.unlinkSync(filePath);
};
export { deletingFile };
