// components/CampaignShipments/AddressSelector.jsx
import { Radio, Input, Checkbox } from "antd";

const { TextArea } = Input;

export default function AddressSelector({ type = "pickup" }) {
  return (
    <div className="space-y-2">
      <Radio.Group defaultValue="current" className="flex flex-col gap-1">
        <Radio value="current">
          Use current {type} address
        </Radio>

        <Radio value="new">
          Add new {type} address
        </Radio>
      </Radio.Group>

      {/* Static expanded form (later control via state) */}
      <div className="mt-2 space-y-2">
        <TextArea
          rows={2}
          placeholder="Address line 1"
        />
        <TextArea
          rows={2}
          placeholder="Address line 2"
        />
        <div className="flex gap-2">
          <Input placeholder="City" />
          <Input placeholder="State" />
          <Input placeholder="Pincode" />
        </div>
      </div>

      <Checkbox>
        Save this address for future shipments
      </Checkbox>
    </div>
  );
}
