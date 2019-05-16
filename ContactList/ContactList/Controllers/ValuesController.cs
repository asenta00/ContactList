using ContactList.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ContactList.Controllers
{
    public class ValuesController : ApiController
    {
        private DBModel db = new DBModel();
        // GET api/values
        public int Get()
        {

            List<Contact> contacts = db.Contact.ToList();
             var br = contacts.Count;

            if (br == 0)
                return 0;
           
            var last = contacts[br -1];
            var num = last.ContactID;
           
            return num;
        }

        [HttpGet]
        [Route("api/values/{filter}/{value}")]
        public List<Contact> GetOrdersByCustName(string filter, string value)
        {
            List<Contact> Res = new List<Contact>();
            switch (filter)
            {
                case "FirstName":
                    Res = (from c in db.Contact
                           where c.FirstName.StartsWith(value)
                           select c).ToList();
                    break;
                case "LastName":
                    Res = (from c in db.Contact
                           where c.LastName.StartsWith(value)
                           select c).ToList();
                    break;
                case "Tag":
                    Res = (from c in db.Contact
                           where c.Tag.StartsWith(value)
                           select c).ToList();
                    break;
            }
            return Res;
        }
        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

      
    }
}
