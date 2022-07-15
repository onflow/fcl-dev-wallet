const AUDITS = {
    "027039e154e468c4e7ca6beca05a992b53d554701813417598e2666136438970": {
        "f_type": "InteractionTemplateAudit",
        "f_vsn": "1.0.0",
        "id": "2ed007ca2bae8640d5397b9c3e07a78f56bdc1b51b0d1738bbc361a81f243069",
        "data": {
          "id": "027039e154e468c4e7ca6beca05a992b53d554701813417598e2666136438970",
          "signer": {
            "address": "0xf8d6e0586b0a20c7",
            "key_id": 0,
            "signature": "de7dc7d7de41b494c3270177c7056bef5128052dc22886271812e103999989c70c229b76e5780f7ab278081ad42a077bdcb9d49afd42c37a579eb037f03db8e8"
          }
        }
      },
    "c1438d5bb6e9df761357050b7626d76026a9d39d35356c0765e31e5a53f0c3d0": {
        "f_type": "InteractionTemplateAudit",
        "f_vsn": "1.0.0",
        "id": "4e2a115ac10b191b38ff7ed3f5f20ca42a61daf28d539bfbd32f188d21142b4b",
        "data": {
          "id": "c1438d5bb6e9df761357050b7626d76026a9d39d35356c0765e31e5a53f0c3d0",
          "signer": {
            "address": "0xf8d6e0586b0a20c7",
            "key_id": 0,
            "signature": "d329a2c8b144eda4adb246258f5edc4e965b372ac325f09e54c7a8f2047687bbf2ce37870f9b7cd4e027ff6c22978a5f1e13e8c4d016e077d5aa0f1ff545dff5"
          }
        }
      },
    "2e68e882762076cf56ccbde8b2a35facf35439dfff31fefd10c83c917ce113e3": {
        "f_type": "InteractionTemplateAudit",
        "f_vsn": "1.0.0",
        "id": "6e6625d5a293ebd287ad7ca6b5501f4b547106e8510516c6a3966e77b45c05bd",
        "data": {
          "id": "2e68e882762076cf56ccbde8b2a35facf35439dfff31fefd10c83c917ce113e3",
          "signer": {
            "address": "0xf8d6e0586b0a20c7",
            "key_id": 0,
            "signature": "bb2fe406fe2a90a7bc18bdb9427644bd9c92f60711c328f8df5cabd04b695977ac8f2932642a3e60affd8ddb682722918393961b2d407c5f8162e910233267c5"
          }
        }
      },
    "d2cdf6fee31617c8e877b915fdaa9b9c5adc7d713ca7547c2270748a3dce4986": {
        "f_type": "InteractionTemplateAudit",
        "f_vsn": "1.0.0",
        "id": "e8d467f8df129dd71f2fcf680b13176729885b7cae3f0b420108c6a0ce179797",
        "data": {
          "id": "d2cdf6fee31617c8e877b915fdaa9b9c5adc7d713ca7547c2270748a3dce4986",
          "signer": {
            "address": "0x25da746d3dd5a0b3",
            "key_id": 0,
            "signature": "5498b60396e08c9e54ace52a8e0f0d9b85f29a143ae54913f42bff7bca0a54cda326c77aaf34fcd5c704cf0a2b06846156556e9ba352c0045f3adb92354f5526"
          }
        }
      }
}

const audit = (req, res) => {
  const { template_id } = req.query

  return res.json(AUDITS[template_id])
} 

export default audit