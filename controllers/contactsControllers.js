import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const user = req.user;
        const contacts = await contactsService.listContacts(user.id);
        res.status(200).json(contacts);
    }
    catch (err) {
        next(err);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const contact = await contactsService.getContact(id, user.id);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json(contact);
    } catch (err) {
        next(err);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const contact = await contactsService.removeContact(id, user.id);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        res.status(200).json(contact);
    } catch (err) {
        next(err);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const user = req.user;
        const newContact = await contactsService.addContact(req.body, user.id);
        res.status(201).json(newContact);
    } catch (err) {
        next(err);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const contact = await contactsService.getContact(id, user.id);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        const updatedContact = await contactsService.updateContact(id, user.id, req.body);
        res.status(200).json(updatedContact);
    } catch (err) {
        next(err);
    }
};

export const updateFavorite = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const contact = await contactsService.getContact(id, user.id);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        const updatedContact = await contactsService.updateStatusContact(id, user.id, req.body);
        res.status(200).json(updatedContact);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};
