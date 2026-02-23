const { SuccessStory, StartupProject, IncubationProgram, User } = require('../models');

exports.getSuccessStories = async (req, res) => {
    try {
        const stories = await SuccessStory.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching success stories', error: error.message });
    }
};

exports.getPrograms = async (req, res) => {
    try {
        const programs = await IncubationProgram.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching programs', error: error.message });
    }
};

exports.submitProject = async (req, res) => {
    try {
        const { projectName, description, category, teamMembers, problemStatement, proposedSolution } = req.body;
        
        const project = await StartupProject.create({
            projectName,
            description,
            category,
            teamMembers,
            problemStatement,
            proposedSolution,
            userId: req.user.id,
            status: 'Pending'
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting project', error: error.message });
    }
};

exports.getMyProjects = async (req, res) => {
    try {
        const projects = await StartupProject.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your projects', error: error.message });
    }
};

// Manager Only Below

exports.createSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.create(req.body);
        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Error creating success story', error: error.message });
    }
};

exports.updateSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.findByPk(req.params.id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        
        await story.update(req.body);
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: 'Error updating success story', error: error.message });
    }
};

exports.deleteSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.findByPk(req.params.id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        
        await story.destroy();
        res.json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting success story', error: error.message });
    }
};

exports.createProgram = async (req, res) => {
    try {
        const program = await IncubationProgram.create(req.body);
        res.status(201).json(program);
    } catch (error) {
        res.status(500).json({ message: 'Error creating program', error: error.message });
    }
};

exports.updateProgram = async (req, res) => {
    try {
        const program = await IncubationProgram.findByPk(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        
        await program.update(req.body);
        res.json(program);
    } catch (error) {
        res.status(500).json({ message: 'Error updating program', error: error.message });
    }
};

exports.deleteProgram = async (req, res) => {
    try {
        const program = await IncubationProgram.findByPk(req.params.id);
        if (!program) return res.status(404).json({ message: 'Program not found' });
        
        await program.destroy();
        res.json({ message: 'Program deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting program', error: error.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await StartupProject.findAll({
            include: [{ model: User, as: 'Submitter', attributes: ['fullName', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all projects', error: error.message });
    }
};

exports.updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const project = await StartupProject.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        await project.update({ status });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project status', error: error.message });
    }
};
