//
//  formExpTableViewController.swift
//  TestWV
//
//  Created by earth on 11/08/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit
import GRDB
import Alamofire
import SwiftyJSON
import NVActivityIndicatorView
import Toaster


class formExpTableViewController: UITableViewController,UINavigationControllerDelegate, UIImagePickerControllerDelegate {

    var site_url = "http://34.231.31.72/xplore/index.php/"
    
    @IBOutlet var imageSelect: UIImageView!
    
    @IBOutlet var selectImageBtn: UIButton!
    var imagePicker = UIImagePickerController()
    
    @IBOutlet weak var titleTF: UITextField!
    
    @IBOutlet weak var descTV: UITextView!
    
    @IBOutlet weak var tagsTF: UITextField!
    
    @IBOutlet weak var identifierTF: UITextField!
    
    @IBOutlet weak var dTPicker: UIDatePicker!
    
    @IBOutlet weak var privateExpSwitch: UISwitch!
    
    @IBOutlet weak var saveBtn: UIButton!
    
    @IBOutlet weak var removeBtn: UIButton!
    
    var ids:[String] = []
    
    public func getIds(){
        do {
            //let databasePath = Bundle(for: type(of: self)).path(forResource: "sqliteDB", ofType: "sqlite")!
            //let dbQueue = try DatabaseQueue(path: databasePath)
            var elCount:Int
            elCount = 0
            try dbQueue.inDatabase { db  in
                elCount = try Int.fetchOne(db, "SELECT COUNT(*) FROM experience")! // Int
                
                print("Count : \(elCount)")
                
            }
            
            
            if elCount > 0{
                try dbQueue.inDatabase { db  in
                    let rows = try Row.fetchCursor(db, "SELECT * FROM experience")
                    ids.removeAll()
                    while let row = try rows.next() {
                        let uniqueId: String = row.value(named: "uniqueId")
                        
                            ids.append(uniqueId)
                        
                    }
                    print(ids)
                 
                    var formatter = DateFormatter()
                    formatter.dateFormat = "dd-MM-yyyy"
                    let stringDate: String = formatter.string(from: dTPicker.date)
                    var privateExp = 0
                    if privateExpSwitch.isOn == true{
                        privateExp = 1
                    }
                    
                    let rows1 = try Row.fetchCursor(db, "SELECT * FROM appUser")
                    var fbId = ""
                    while let row1 = try rows1.next() {
                        let uniqueId: String = row1.value(named: "fbId")
                        fbId = uniqueId
                        
                    }
                    
                    let params: Parameters = [
                        
                        "title": titleTF.text!,
                        "desc": descTV.text as String,
                        "tags": tagsTF.text!,
                        "identifier": identifierTF.text!,
                        "dateT": stringDate,
                        "privateExp": String(privateExp),
                        "fbId": fbId,
                        "SrNumber" : self.ids
                    ]
                    
                    print(params)
                    
                    Alamofire.request(site_url + "site/saveExperienceNative", method: .post, parameters: params).responseJSON { response in
                        switch response.result {
                        case .success:
                            print(response)
                            Toast(text: "Experience saved successfully").show()
                            self.titleTF.text = ""
                            self.descTV.text = ""
                            self.tagsTF.text = ""
                            self.identifierTF.text = ""
                            
                        case .failure(let error):
                            print("Error \(error)")
                            Toast(text: "Something went wrong..!").show()
                        }
                    }

                    
                }
            }else{
                print("Not enough records to save")
            }
        }catch {
            print(error.localizedDescription)
        }
        
    }
    
    @IBAction func removeImg(_ sender: UIButton) {
        print("remove clicked")
    }
    
    @IBAction func saveExpForm(_ sender: UIButton) {
        
        
        if let title = titleTF.text, !title.isEmpty
        {
            if let desc = descTV.text, !desc.isEmpty
            {
                if let identi = identifierTF.text, !identi.isEmpty
                {
                    if let tags = tagsTF.text, !tags.isEmpty
                    {
                        getIds()
                    }else{
                        Toast(text: "Please provide some value for Tags").show()
                    }
                }else{
                    Toast(text: "Please provide some value for Identifier").show()
                }
            }else{
                Toast(text: "Please provide some value for Description").show()
            }
        }else{
            Toast(text: "Please provide some value for Title").show()
        }
        
        
    }
    
    var dbQueue: DatabaseQueue!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpDatabasePath()

        tableView.backgroundView = UIImageView(image: UIImage(named: "header_bg")?.resizableImage(withCapInsets: UIEdgeInsets.zero, resizingMode: .tile))
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }
    
    func setUpDatabasePath()
    {
        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
        let databasePath = documentsPath.appendingPathComponent("sqliteDB.sqlite")
        print("DATABASE PATH !!!!")
        print(databasePath)
        let fileManager:FileManager = FileManager.default
        var success = fileManager.fileExists(atPath: databasePath)
        if (success)
        {
            dbQueue = try! DatabaseQueue(path: databasePath)
            print("writing to documents directory")
            print(databasePath)
            //break
            return
        }
        if (!success)
        {
            let bundlePath = Bundle.main.path(forResource: "sqliteDB", ofType: "sqlite")
            success = fileManager.fileExists(atPath: bundlePath!)
            print("writing from app bundle")
            if (success)
            {
                try! fileManager.copyItem(atPath: bundlePath!, toPath: databasePath)
                dbQueue = try! DatabaseQueue(path: databasePath)
            }
            else
            {
                print("Could not find database")
            }
            return
        }
    }

    @IBAction func selectImageBtnClicked(_ sender: UIButton) {
        if UIImagePickerController.isSourceTypeAvailable(.savedPhotosAlbum){
            print("Button capture")
            
            imagePicker.delegate = self
            imagePicker.sourceType = .savedPhotosAlbum;
            imagePicker.allowsEditing = false
            
            self.present(imagePicker, animated: true, completion: nil)
        }
    }
    
    func imagePickerController(picker: UIImagePickerController!, didFinishPickingImage image: UIImage!, editingInfo: NSDictionary!){
        self.dismiss(animated: true, completion: { () -> Void in
            
        })
        
        imageSelect.image = image
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 11
    }

    /*
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
