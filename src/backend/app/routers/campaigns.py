from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
from app.core.dependencies import require_manager

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

# Predefined campaigns (enum values)
dynamic_campaigns: List[str] = []

class CampaignCreate(BaseModel):
    name: str

@router.get("/")
def get_campaigns():
    from app.models.call import Campaign
    all_campaigns = [c.value for c in Campaign] + dynamic_campaigns
    return {"campaigns": all_campaigns}

@router.post("/")
def add_campaign(campaign: CampaignCreate, current_user=Depends(require_manager)):
    if campaign.name in dynamic_campaigns:
        raise HTTPException(status_code=400, detail="Campaign already exists")
    dynamic_campaigns.append(campaign.name)
    return {"message": "Campaign added", "campaigns": dynamic_campaigns}
