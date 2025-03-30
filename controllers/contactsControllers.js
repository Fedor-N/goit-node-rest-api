import * as contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts);
    }
    catch (err) {
        next(err);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);
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
        const contact = await contactsService.removeContact(id);
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
        const newContact = await contactsService.addContact(req.body);
        res.status(201).json(newContact);
    } catch (err) {
        next(err);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.getContactById(id);
        if (!contact) {
            return res.status(404).json({ message: "Not found" });
        }
        const updatedContact = await contactsService.updateContact(id, req.body);
        res.status(200).json(updatedContact);
    } catch (err) {
        next(err);
    }
};
