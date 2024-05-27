// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.18;

contract EnhancedDataRequestContract {
    enum RequestStatus {
        Pending,
        Approved,
        Rejected
    }

    struct DataRequest {
        uint256 id;
        address requester;
        address user;
        string[] fields;
        RequestStatus status;
    }

    mapping(uint256 => DataRequest) public requests;
    mapping(address => uint256[]) public userToRequestIds;
    mapping(address => uint256[]) public requesterToRequestIds; // New mapping

    uint256 private requestIdCounter = 0;

    event NewDataRequest(
        uint256 requestId,
        address indexed requester,
        address indexed user,
        string[] fields
    );
    event DataRequestApproved(uint256 requestId);
    event DataRequestRejected(uint256 requestId);

    function requestData(address _user, string[] memory _fields) public {
        require(_fields.length > 0, "At least one field should be requested.");

        requestIdCounter++;

        requests[requestIdCounter] = DataRequest({
            id: requestIdCounter,
            requester: msg.sender,
            user: _user,
            fields: _fields,
            status: RequestStatus.Pending
        });

        userToRequestIds[_user].push(requestIdCounter);
        requesterToRequestIds[msg.sender].push(requestIdCounter); // Update the new mapping

        emit NewDataRequest(requestIdCounter, msg.sender, _user, _fields);
    }

    function approveRequest(uint256 _requestId) public {
        DataRequest storage req = requests[_requestId];

        require(
            msg.sender == req.user,
            "Only the associated user can approve this request"
        );
        require(
            req.status == RequestStatus.Pending,
            "Request is not in a pending state"
        );

        req.status = RequestStatus.Approved;

        emit DataRequestApproved(_requestId);
    }

    function rejectRequest(uint256 _requestId) public {
        DataRequest storage req = requests[_requestId];

        require(
            msg.sender == req.user,
            "Only the associated user can reject this request"
        );
        require(
            req.status == RequestStatus.Pending,
            "Request is not in a pending state"
        );

        req.status = RequestStatus.Rejected;

        emit DataRequestRejected(_requestId);
    }

    function getRequestStatus(
        uint256 _requestId
    ) public view returns (RequestStatus) {
        return requests[_requestId].status;
    }

    function getUserRequests(
        address _user
    ) public view returns (uint256[] memory) {
        return userToRequestIds[_user];
    }

    function getDetailedUserRequests(
        address _user
    ) public view returns (DataRequest[] memory) {
        uint256[] memory ids = userToRequestIds[_user];
        DataRequest[] memory userRequests = new DataRequest[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            userRequests[i] = requests[ids[i]];
        }

        return userRequests;
    }

    // New function to get all request IDs where the provided address is the requester
    function getRequestsByRequester(
        address _requester
    ) public view returns (uint256[] memory) {
        return requesterToRequestIds[_requester];
    }

    // Additional functionalities can be added as per requirements.
}
