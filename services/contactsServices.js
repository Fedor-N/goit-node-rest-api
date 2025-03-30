import Contact from '../models/contact.js';

export async function listContacts(userId) {
    return Contact.findAll({
        where: {
            owner: userId
        }
    });
}

export async function getContact(contactId, userId) {
    return await Contact.findOne({
        where: {
            id: contactId,
            owner: userId
        }
    });
}

export async function removeContact(contactId, userId) {
    const contact = await getContact(contactId, userId);
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

export async function addContact(data, userId) {
    const { name, email, phone } = data;
    return await Contact.create({
        name,
        email,
        phone,
        owner: userId,
    });
}

export async function updateContact(id, userId, data) {
    await Contact.update(
        { ...data },
        {
            where: {
                id: id,
                owner: userId,
            },
        }
    );
    return await getContact(id, userId);
}

export async function updateStatusContact(contactId, userId, body) {
    const { favorite } = body;
    return updateContact(contactId, userId, { favorite });
}