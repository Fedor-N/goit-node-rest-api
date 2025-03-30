import Contact from '../models/contact.js';

export async function listContacts() {
    return Contact.findAll();
}

export async function getContactById(contactId) {
    return Contact.findByPk(contactId);
}

export async function removeContact(contactId) {
    const contact = await Contact.findByPk(contactId);
    if (!contact) {
        return null;
    }

    await Contact.destroy({
        where: {
            id: contactId
        }
    });

    return contact;
}

export async function addContact(data) {
    const { name, email, phone } = data;
    return await Contact.create({
        name,
        email,
        phone
    });
}

export async function updateContact(id, data) {
    await Contact.update(
        { ...data },
        {
            where: {
                id: id,
            },
        }
    );
    return await Contact.findByPk(id);
}

export async function updateStatusContact(contactId, body) {
    const { favorite } = body;
    return updateContact(contactId, { favorite });
}