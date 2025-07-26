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

export async function searchHubSpotContactByEmail(email: string): Promise<any | null> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('HubSpot access token not configured');
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email
              }
            ]
          }
        ],
        properties: ['email', 'firstname', 'lastname', 'company'],
        limit: 1
      })
    });

    if (!response.ok) {
      console.error('HubSpot search failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0] : null;
  } catch (error) {
    console.error('Error searching HubSpot contact:', error);
    return null;
  }
}

export async function createHubSpotLead(leadData: LeadData): Promise<any> {
  const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('HubSpot access token not configured');
  }

  // First, check if contact already exists
  const existingContact = await searchHubSpotContactByEmail(leadData.email);
  
  if (existingContact) {
    console.log(`Contact already exists in HubSpot: ${existingContact.id}`);
    return {
      id: existingContact.id,
      email: leadData.email,
      hubspotId: existingContact.id,
      isNew: false,
      message: 'Contact already exists'
    };
  }

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
        'Authorization': `Bearer ${accessToken}`,
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
      isNew: true,
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