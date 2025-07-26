export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  country: string;
  industry: string;
  companySize: string;
  businessGoals?: string;
  businessIdea: string;
  source: string;
}

export async function createHubSpotLead(leadData: LeadData): Promise<any> {
  // Use only basic properties that exist by default in all HubSpot portals
  const hubspotProperties = {
    firstname: leadData.firstName,
    lastname: leadData.lastName,
    email: leadData.email,
    company: leadData.company,
    jobtitle: leadData.jobTitle,
    phone: leadData.phone,
    country: leadData.country,
    industry: leadData.industry,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
  };

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: hubspotProperties,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const contactData = await response.json();
    console.log('HubSpot lead created successfully:', contactData.id);
    
    return {
      id: contactData.id,
      email: leadData.email,
      hubspotId: contactData.id,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating HubSpot lead:', error);
    throw new Error('Failed to create lead in HubSpot');
  }
}

export async function updateHubSpotContact(contactId: string, additionalData: Record<string, any>): Promise<any> {
  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: additionalData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating HubSpot contact:', error);
    throw new Error('Failed to update contact in HubSpot');
  }
}