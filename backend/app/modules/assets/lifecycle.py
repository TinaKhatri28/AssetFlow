from app.modules.assets.models import AssetStatus

# Define exactly which state changes are allowed
VALID_TRANSITIONS = {
    AssetStatus.AVAILABLE: {AssetStatus.ALLOCATED, AssetStatus.RESERVED, AssetStatus.UNDER_MAINTENANCE, AssetStatus.RETIRED, AssetStatus.DISPOSED, AssetStatus.LOST},
    AssetStatus.ALLOCATED: {AssetStatus.AVAILABLE, AssetStatus.UNDER_MAINTENANCE, AssetStatus.LOST},
    AssetStatus.RESERVED: {AssetStatus.AVAILABLE, AssetStatus.ALLOCATED},
    AssetStatus.UNDER_MAINTENANCE: {AssetStatus.AVAILABLE, AssetStatus.RETIRED, AssetStatus.DISPOSED},
    AssetStatus.LOST: {AssetStatus.AVAILABLE}, # If it is found later
    AssetStatus.RETIRED: {AssetStatus.DISPOSED},
    AssetStatus.DISPOSED: set(), # Terminal state, cannot leave this state
}

class IllegalStateTransitionError(Exception):
    pass

def assert_valid_transition(current_status: AssetStatus, target_status: AssetStatus):
    """Throws an error if the requested status change is not allowed."""
    if target_status not in VALID_TRANSITIONS.get(current_status, set()):
        raise IllegalStateTransitionError(f"Cannot transition asset from {current_status} to {target_status}")