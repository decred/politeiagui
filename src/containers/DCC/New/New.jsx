import React from "react";
import { Card } from "pi-ui";
import DccForm from "src/components/DccForm";
import DccLoader from "src/components/DCC/DccLoader";
import { useNewDcc } from "./hooks";

const NewDcc = () => {
  const { onSubmitDcc, users, loading, user } = useNewDcc();
  return (
    <Card className="container margin-bottom-l">
      {users && user && !loading ? (
        <DccForm
          onSubmit={onSubmitDcc}
          cmsUsers={users}
          userDomain={user.domain}
        />
      ) : (
        <DccLoader extended />
      )}
    </Card>
  );
};

export default NewDcc;
