import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getOneSavedContainer = async (cid: string) => {
  let savedConatainer;
  try {
    savedConatainer = await prisma.container.findUnique({
      where: {
        id: parseInt(cid),
      },
    });
  } catch (err) {
    return err;
  }
  return savedConatainer;
};

module.exports = {
  getOneSavedContainer,
};
