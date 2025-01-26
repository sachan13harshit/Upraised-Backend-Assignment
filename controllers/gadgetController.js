const {PrismaClient} = require('@prisma/client');
const {z} = require('zod');
const {generateToken} = require('../utils/generateToken');

const prisma = new PrismaClient();

const gadgetSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});


const getAllGadgets = async (req, res) => {
    const {status} = req.query;
    const where = status ? {status} : {};
    try{
        const gadgets = await prisma.gadget.findMany({where});
        const gadgetDatawithProbability = gadgets.map(gadget => ({
            ...gadget,
            missionSuccessProbability: Math.random()
        }));
        res.status(201).json(gadgetDatawithProbability);
    }
    catch(error){
        res.status(500).json({
            error: "Failed to fetch gadgets"
        });
    }
};

const createGadget = async (req, res) => {
    try {
        const data = gadgetSchema.parse(req.body);
        const codename = await generateToken();
        const gadget = await prisma.gadget.create({
          data: {
            ...data,
            codename
          }
        });
    
        res.status(201).json(gadget);
      } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
          res.status(400).json({ error: 'Validation error', details: error.errors });
        } else {
          res.status(500).json({ error: 'Failed to create gadget' });
        }
      }
};


const updateGadget = async (req, res) => {
    try {
      const { id } = req.params; 
      const data = gadgetSchema.partial().parse(req.body);  // Validate incoming data
      const existingGadget = await prisma.gadget.findUnique({
        where: { id }
      });
      
      if (!existingGadget) {
        return res.status(404).json({ error: 'Gadget not found' });  // Return 404 if gadget is not found
      }
      const updatedGadget = await prisma.gadget.update({
        where: { id },
        data
      });

      res.json(updatedGadget);  
    } catch (error) {
      console.log(error); 
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update gadget', details: error.message });
      }
    }
  };


 const decommissionGadget = async (req, res) => {
    try {
      const { id } = req.params;
      const gadget = await prisma.gadget.update({
        where: { id },
        data: {
          status: 'DECOMMISSIONED',
          decommissionedAt: new Date()
        }
      });
  
      res.json(gadget);
    } catch (error) {
      res.status(500).json({ error: 'Failed to decommission gadget' });
    }
  };


  const selfDestructGadget = async (req, res) => {
    try {
      const { id } = req.params;
      const { confirmationCode } = req.body;
      const expectedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      if (confirmationCode !== expectedCode) {
        return res.status(400).json({ error: 'Invalid confirmation code' });
      }
      const gadget = await prisma.gadget.update({
        where: { id },
        data: {
          status: 'DESTROYED'
        }
      });
      res.json({
        message: 'Gadget self-destruct sequence completed',
        gadget
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to execute self-destruct sequence' });
    }
  };


  module.exports = {
    getAllGadgets,
    createGadget,
    updateGadget,
    decommissionGadget,
    selfDestructGadget
  };

