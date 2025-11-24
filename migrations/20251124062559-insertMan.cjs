module.exports = {
  async up(db, client) {
    const userPermissions = [
      {
        name: "manager",
        permissions: [
          {
            name: "Create Therapist",
            permission: "therapist.create",
            module: "therapist",
            description: "Create a therapist",
          },
          {
            name: "View Therapist",
            permission: "therapist.view",
            module: "therapist",
            description: "View therapists",
          },
          {
            name: "Edit Therapist",
            permission: "therapist.edit",
            module: "therapist",
            description: "Edit a therapist",
          },
          {
            name: "Delete Therapist",
            permission: "therapist.delete",
            module: "therapist",
            description: "Delete a therapist",
          },
          {
            name: "Activate Therapist",
            permission: "therapist.activate",
            module: "therapist",
            description: "Activate a therapist",
          },
          {
            name: "Inactivate Therapist",
            permission: "therapist.inactivate",
            module: "therapist",
            description: "Inactivate a therapist",
          },
          {
            name: "Create Patient",
            permission: "patient.create",
            module: "patient",
            description: "Create a patient",
          },
          {
            name: "View Patient",
            permission: "patient.view",
            module: "patient",
            description: "View patients",
          },
          {
            name: "Edit Patient",
            permission: "patient.edit",
            module: "patient",
            description: "Edit a patient",
          },
          {
            name: "Delete Patient",
            permission: "patient.delete",
            module: "patient",
            description: "Delete a patient",
          },
          {
            name: "Activate Patient",
            permission: "patient.activate",
            module: "patient",
            description: "Activate a patient",
          },
          {
            name: "Inactivate Patient",
            permission: "patient.inactivate",
            module: "patient",
            description: "Inactivate a patient",
          },
          {
            name: "Create Session",
            permission: "session.create",
            module: "session",
            description: "Create a session",
          },
          {
            name: "View Session",
            permission: "session.view",
            module: "session",
            description: "View sessions",
          },
          {
            name: "Edit Session",
            permission: "session.edit",
            module: "session",
            description: "Edit a session",
          },
          {
            name: "Cancel Session",
            permission: "session.cancel",
            module: "session",
            description: "Cancel a session",
          },
          {
            name: "View Diary",
            permission: "diary.view",
            module: "diary",
            description: "View diary entries",
          },
          {
            name: "View Report",
            permission: "report.view",
            module: "report",
            description: "View reports",
          },
          {
            name: "View Control Panel",
            permission: "controlPanel.view",
            module: "controlPanel",
            description: "View the control panel",
          },
        ],
      },
      {
        name: "receptionist",
        permissions: [
          {
            name: "Create Patient",
            permission: "patient.create",
            module: "patient",
            description: "Create a patient",
          },
          {
            name: "View Patient",
            permission: "patient.view",
            module: "patient",
            description: "View patients",
          },
          {
            name: "Edit Patient",
            permission: "patient.edit",
            module: "patient",
            description: "Edit a patient",
          },
          {
            name: "Delete Patient",
            permission: "patient.delete",
            module: "patient",
            description: "Delete a patient",
          },
          {
            name: "Activate Patient",
            permission: "patient.activate",
            module: "patient",
            description: "Activate a patient",
          },
          {
            name: "Inactivate Patient",
            permission: "patient.inactivate",
            module: "patient",
            description: "Inactivate a patient",
          },
          {
            name: "Create Session",
            permission: "session.create",
            module: "session",
            description: "Create a session",
          },
          {
            name: "View Session",
            permission: "session.view",
            module: "session",
            description: "View sessions",
          },
          {
            name: "Edit Session",
            permission: "session.edit",
            module: "session",
            description: "Edit a session",
          },
          {
            name: "Cancel Session",
            permission: "session.cancel",
            module: "session",
            description: "Cancel a session",
          },
          {
            name: "View Diary",
            permission: "diary.view",
            module: "diary",
            description: "View diary entries",
          },
          {
            name: "View Report",
            permission: "report.view",
            module: "report",
            description: "View reports",
          },
          {
            name: "View Control Panel",
            permission: "controlPanel.view",
            module: "controlPanel",
            description: "View the control panel",
          },
        ],
      },
    ];

    for (const role of userPermissions) {
      const rolesCollection = db.collection("roles");

      const exists = await rolesCollection.findOne({ name: role.name });

      if (!exists) {
        await rolesCollection.insertOne({
          _id: new ObjectId(),
          name: role.name,
          permissions: role.permissions,
          created_at: new Date(),
          updated_at: new Date(),
        });

        console.log(`✔️ Inserted role: ${role.name}`);
      } else {
        console.log(`ℹ️ Role '${role.name}' already exists, skipping.`);
      }
    }
  },

  async down(db, client) {},
};
