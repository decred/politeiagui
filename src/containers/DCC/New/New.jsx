import React from "react";
import { Card } from "pi-ui";
import DccForm from "src/componentsv2/DccForm";
import DccLoader from "src/componentsv2/DCC/DCCLoader";
import { useNewDcc } from "./hooks";

const NewDcc = () => {
  const { onSubmitDcc, users, loading, user } = useNewDcc();
  return (
    <Card className="container margin-bottom-l">
      {users && user && !loading ? (
        <DccForm onSubmit={onSubmitDcc} cmsUsers={users} userDomain={user.domain}/>
      ) : (
        <DccLoader extended />
      )}
    </Card>
  );
};

export default NewDcc;
