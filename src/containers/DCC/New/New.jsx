import React from "react";
import { Card } from "pi-ui";
import DccForm from "src/componentsv2/DccForm";
import DccLoader from "src/componentsv2/DCC/DCCLoader";
import { useNewDcc } from "./hooks";

const NewDcc = () => {
  const { onSubmitDcc, users, loading } = useNewDcc();
  return (
    <Card className="container margin-bottom-l">
      {users && !loading ? (
        <DccForm onSubmit={onSubmitDcc} cmsUsers={users}/>
      ) : (
        <DccLoader extended />
      )}
    </Card>
  );
};

export default NewDcc;
