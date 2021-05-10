import React from "react";
import { Card, Message } from "pi-ui";
import DccForm from "src/components/DccForm";
import DccLoader from "src/components/DCC/DccLoader";
import { useNewDcc } from "./hooks";

const NewDcc = () => {
  const { onSubmitDcc, users, loading, user, isUserValid, usersError } =
    useNewDcc();
  return (
    <Card className="container margin-bottom-l">
      {usersError ? (
        <Message kind="error">
          {usersError.toString()}. Users list is not available. Please, try
          again later
        </Message>
      ) : users && user && !loading ? (
        <DccForm
          onSubmit={onSubmitDcc}
          cmsUsers={users}
          userDomain={user.domain}
          isUserValid={isUserValid}
        />
      ) : (
        <DccLoader extended />
      )}
    </Card>
  );
};

export default NewDcc;
